export function getMenuStock(inventory, menuId) {
  return inventory.find((item) => item.menuId === menuId)?.stock ?? 0
}

export function getCartMenuQuantity(cartItems, menuId) {
  return cartItems
    .filter((item) => item.menuId === menuId)
    .reduce((sum, item) => sum + item.quantity, 0)
}

export function canAddMenuToCart(inventory, cartItems, menuId) {
  const stock = getMenuStock(inventory, menuId)
  const inCart = getCartMenuQuantity(cartItems, menuId)

  return stock > 0 && inCart < stock
}

export function getMaxQuantityForCartItem(inventory, cartItems, cartKey) {
  const item = cartItems.find((cartItem) => cartItem.key === cartKey)
  if (!item) return 0

  const stock = getMenuStock(inventory, item.menuId)
  const otherQuantity = cartItems
    .filter((cartItem) => cartItem.menuId === item.menuId && cartItem.key !== cartKey)
    .reduce((sum, cartItem) => sum + cartItem.quantity, 0)

  return Math.max(0, stock - otherQuantity)
}

export function getQuantityOptions(inventory, cartItems, item) {
  const maxQuantity = getMaxQuantityForCartItem(inventory, cartItems, item.key)
  const limit = Math.max(1, maxQuantity)

  return Array.from({ length: limit }, (_, index) => index + 1)
}

export function validateCartStock(inventory, cartItems) {
  const requiredByMenu = cartItems.reduce((acc, item) => {
    acc[item.menuId] = (acc[item.menuId] ?? 0) + item.quantity
    return acc
  }, {})

  for (const [menuId, required] of Object.entries(requiredByMenu)) {
    const stock = getMenuStock(inventory, Number(menuId))
    const menuName =
      inventory.find((item) => item.menuId === Number(menuId))?.menuName ?? '메뉴'

    if (stock === 0) {
      return {
        valid: false,
        message: `${menuName}은(는) 품절 상태입니다.`,
      }
    }

    if (required > stock) {
      return {
        valid: false,
        message: `${menuName}의 재고가 부족합니다. (재고: ${stock}개)`,
      }
    }
  }

  return { valid: true }
}
