import { pool } from '../db/pool.js'
import { AppError } from '../utils/errors.js'
import { buildOrderResponse } from './orderHelpers.js'

export async function getDashboardStats() {
  const [statusResult, salesResult] = await Promise.all([
    pool.query(`
      SELECT status, COUNT(*)::INT AS count
      FROM orders
      GROUP BY status
    `),
    pool.query(`
      SELECT
        COALESCE(SUM(CASE WHEN o.ordered_at::date = CURRENT_DATE THEN oi.quantity END), 0)::INT AS "todayCupsSold",
        COALESCE(SUM(CASE WHEN o.ordered_at::date = CURRENT_DATE - INTERVAL '1 day' THEN oi.quantity END), 0)::INT AS "yesterdayCupsSold",
        TO_CHAR(CURRENT_DATE, 'YYYY-MM-DD') AS "todayDate"
      FROM order_items oi
      INNER JOIN orders o ON o.id = oi.order_id
      WHERE o.ordered_at::date >= CURRENT_DATE - INTERVAL '1 day'
    `),
  ])

  const salesRow = salesResult.rows[0]

  const stats = {
    total: 0,
    received: 0,
    preparing: 0,
    completed: 0,
    todayCupsSold: salesRow.todayCupsSold,
    yesterdayCupsSold: salesRow.yesterdayCupsSold,
    todayDate: salesRow.todayDate,
  }

  for (const row of statusResult.rows) {
    stats[row.status] = row.count
    stats.total += row.count
  }

  return stats
}

export async function getInventory() {
  const result = await pool.query(`
    SELECT id AS "menuId", name AS "menuName", stock
    FROM menus
    ORDER BY id
  `)

  return result.rows
}

export async function updateInventory(menuId, stock) {
  if (!Number.isInteger(stock) || stock < 0) {
    throw new AppError(400, '재고는 0 이상의 정수여야 합니다.', 'INVALID_STOCK')
  }

  const result = await pool.query(
    `
    UPDATE menus
    SET stock = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id AS "menuId", name AS "menuName", stock
    `,
    [stock, menuId],
  )

  if (result.rows.length === 0) {
    throw new AppError(404, '메뉴를 찾을 수 없습니다.', 'MENU_NOT_FOUND')
  }

  return result.rows[0]
}

export async function getAdminOrders() {
  const ordersResult = await pool.query(`
    SELECT id, ordered_at, total_amount, status
    FROM orders
    ORDER BY ordered_at DESC, id DESC
  `)

  if (ordersResult.rows.length === 0) {
    return []
  }

  const orderIds = ordersResult.rows.map((order) => order.id)

  const itemsResult = await pool.query(
    `
    SELECT
      oi.id,
      oi.order_id,
      oi.menu_id,
      oi.menu_name,
      oi.quantity,
      oi.unit_price,
      oi.line_amount,
      oio.option_name,
      oio.option_price
    FROM order_items oi
    LEFT JOIN order_item_options oio ON oio.order_item_id = oi.id
    WHERE oi.order_id = ANY($1::int[])
    ORDER BY oi.order_id, oi.id, oio.id
    `,
    [orderIds],
  )

  const itemsByOrder = itemsResult.rows.reduce((acc, row) => {
    if (!acc[row.order_id]) {
      acc[row.order_id] = []
    }

    acc[row.order_id].push(row)
    return acc
  }, {})

  return ordersResult.rows.map((order) =>
    buildOrderResponse(order, itemsByOrder[order.id] ?? [], { adminOptionsAsStrings: true }),
  )
}

const ALLOWED_STATUS_TRANSITIONS = {
  received: 'preparing',
  preparing: 'completed',
}

export async function updateOrderStatus(orderId, status) {
  const allowedNext = ALLOWED_STATUS_TRANSITIONS

  const result = await pool.query(
    `
    SELECT id, status
    FROM orders
    WHERE id = $1
    `,
    [orderId],
  )

  if (result.rows.length === 0) {
    throw new AppError(404, '주문을 찾을 수 없습니다.', 'ORDER_NOT_FOUND')
  }

  const currentStatus = result.rows[0].status

  if (allowedNext[currentStatus] !== status) {
    throw new AppError(400, '허용되지 않은 상태 변경입니다.', 'INVALID_STATUS_TRANSITION')
  }

  const updated = await pool.query(
    `
    UPDATE orders
    SET status = $1, updated_at = NOW()
    WHERE id = $2
    RETURNING id, ordered_at, total_amount, status
    `,
    [status, orderId],
  )

  return {
    orderId: updated.rows[0].id,
    orderedAt: updated.rows[0].ordered_at,
    totalAmount: updated.rows[0].total_amount,
    status: updated.rows[0].status,
  }
}
