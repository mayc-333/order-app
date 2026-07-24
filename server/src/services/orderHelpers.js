export function buildOrderResponse(order, itemRows, { adminOptionsAsStrings = false } = {}) {
  const itemsMap = new Map()

  for (const row of itemRows) {
    if (!itemsMap.has(row.id)) {
      itemsMap.set(row.id, {
        menuId: row.menu_id,
        menuName: row.menu_name,
        quantity: row.quantity,
        unitPrice: row.unit_price,
        lineAmount: row.line_amount,
        options: [],
      })
    }

    if (row.option_name) {
      const item = itemsMap.get(row.id)

      if (adminOptionsAsStrings) {
        item.options.push(row.option_name)
      } else {
        item.options.push({
          name: row.option_name,
          price: row.option_price,
        })
      }
    }
  }

  return {
    orderId: order.id,
    orderedAt: order.ordered_at,
    totalAmount: order.total_amount,
    status: order.status,
    items: [...itemsMap.values()],
  }
}
