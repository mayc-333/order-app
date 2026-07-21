export function getStockStatus(stock) {
  if (stock === 0) {
    return { label: '품절', className: 'stock-out' }
  }

  if (stock < 5) {
    return { label: '주의', className: 'stock-warning' }
  }

  return { label: '정상', className: 'stock-normal' }
}
