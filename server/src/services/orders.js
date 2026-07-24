import { pool } from '../db/pool.js'
import { AppError } from '../utils/errors.js'
import { buildOrderResponse } from './orderHelpers.js'

async function fetchOrderRows(client, orderId) {
  const orderResult = await client.query(
    `
    SELECT id, ordered_at, total_amount, status
    FROM orders
    WHERE id = $1
    `,
    [orderId],
  )

  if (orderResult.rows.length === 0) {
    return null
  }

  const itemsResult = await client.query(
    `
    SELECT
      oi.id,
      oi.menu_id,
      oi.menu_name,
      oi.quantity,
      oi.unit_price,
      oi.line_amount,
      oio.option_name,
      oio.option_price
    FROM order_items oi
    LEFT JOIN order_item_options oio ON oio.order_item_id = oi.id
    WHERE oi.order_id = $1
    ORDER BY oi.id, oio.id
    `,
    [orderId],
  )

  return { order: orderResult.rows[0], itemRows: itemsResult.rows }
}

export async function getOrderById(orderId) {
  const client = await pool.connect()

  try {
    const data = await fetchOrderRows(client, orderId)

    if (!data) {
      return null
    }

    return buildOrderResponse(data.order, data.itemRows)
  } finally {
    client.release()
  }
}

export async function createOrder(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError(400, '주문 항목이 필요합니다.', 'INVALID_REQUEST')
  }

  const client = await pool.connect()

  try {
    await client.query('BEGIN')

    const quantityByMenu = items.reduce((acc, item) => {
      if (!item.menuId || !item.quantity || item.quantity < 1) {
        throw new AppError(400, '잘못된 주문 항목입니다.', 'INVALID_REQUEST')
      }

      acc[item.menuId] = (acc[item.menuId] ?? 0) + item.quantity
      return acc
    }, {})

    const menuCache = new Map()

    for (const menuId of Object.keys(quantityByMenu)) {
      const result = await client.query(
        `
        SELECT id, name, price, stock
        FROM menus
        WHERE id = $1
        FOR UPDATE
        `,
        [menuId],
      )

      if (result.rows.length === 0) {
        throw new AppError(404, `메뉴(ID: ${menuId})를 찾을 수 없습니다.`, 'MENU_NOT_FOUND')
      }

      const menu = result.rows[0]

      if (menu.stock < quantityByMenu[menuId]) {
        throw new AppError(
          400,
          `${menu.name}의 재고가 부족합니다.`,
          'INSUFFICIENT_STOCK',
        )
      }

      menuCache.set(Number(menuId), menu)
    }

    let totalAmount = 0
    const preparedItems = []

    for (const item of items) {
      const menu = menuCache.get(item.menuId)
      const optionIds = item.optionIds ?? []

      const optionsResult = await client.query(
        `
        SELECT id, name, price
        FROM options
        WHERE menu_id = $1 AND id = ANY($2::int[])
        ORDER BY id
        `,
        [item.menuId, optionIds],
      )

      if (optionsResult.rows.length !== optionIds.length) {
        throw new AppError(400, '유효하지 않은 옵션이 포함되어 있습니다.', 'INVALID_OPTION')
      }

      const unitPrice =
        menu.price + optionsResult.rows.reduce((sum, option) => sum + option.price, 0)
      const lineAmount = unitPrice * item.quantity
      totalAmount += lineAmount

      preparedItems.push({
        menuId: menu.id,
        menuName: menu.name,
        quantity: item.quantity,
        unitPrice,
        lineAmount,
        options: optionsResult.rows,
      })
    }

    const orderResult = await client.query(
      `
      INSERT INTO orders (total_amount, status)
      VALUES ($1, 'received')
      RETURNING id, ordered_at, total_amount, status
      `,
      [totalAmount],
    )

    const order = orderResult.rows[0]

    for (const preparedItem of preparedItems) {
      const itemResult = await client.query(
        `
        INSERT INTO order_items (order_id, menu_id, menu_name, quantity, unit_price, line_amount)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
        `,
        [
          order.id,
          preparedItem.menuId,
          preparedItem.menuName,
          preparedItem.quantity,
          preparedItem.unitPrice,
          preparedItem.lineAmount,
        ],
      )

      const orderItemId = itemResult.rows[0].id

      for (const option of preparedItem.options) {
        await client.query(
          `
          INSERT INTO order_item_options (order_item_id, option_id, option_name, option_price)
          VALUES ($1, $2, $3, $4)
          `,
          [orderItemId, option.id, option.name, option.price],
        )
      }
    }

    for (const [menuId, quantity] of Object.entries(quantityByMenu)) {
      await client.query(
        `
        UPDATE menus
        SET stock = stock - $1, updated_at = NOW()
        WHERE id = $2
        `,
        [quantity, menuId],
      )
    }

    await client.query('COMMIT')

    const saved = await fetchOrderRows(client, order.id)
    return buildOrderResponse(saved.order, saved.itemRows)
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
