export function getCartKey(menuId, optionIds) {
  return `${menuId}-${[...optionIds].sort().join(',')}`
}

export function calcUnitPrice(basePrice, selectedOptions) {
  return basePrice + selectedOptions.reduce((sum, option) => sum + option.price, 0)
}
