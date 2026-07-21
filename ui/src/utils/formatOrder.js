export function formatOrderDate(date) {
  const value = new Date(date)
  const month = value.getMonth() + 1
  const day = value.getDate()
  const hours = String(value.getHours()).padStart(2, '0')
  const minutes = String(value.getMinutes()).padStart(2, '0')

  return `${month}월 ${day}일 ${hours}:${minutes}`
}

export function formatOrderItem(item) {
  const optionText =
    item.options.length > 0
      ? ` (${item.options.map((option) => option.name).join(', ')})`
      : ''

  return `${item.menuName}${optionText} x ${item.quantity}`
}
