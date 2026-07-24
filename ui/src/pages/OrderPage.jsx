import { useState } from 'react'
import Header from '../components/Header'
import MenuCard from '../components/MenuCard'
import ShoppingCart from '../components/ShoppingCart'
import { calcUnitPrice, getCartKey } from '../utils/cart'
import {
  canAddMenuToCart,
  getMenuStock,
  validateCartStock,
} from '../utils/inventory'

function OrderPage({
  onNavigate,
  menus,
  inventory,
  cartItems,
  setCartItems,
  onPlaceOrder,
}) {
  const [selectedOptions, setSelectedOptions] = useState({})
  const cartValidation = validateCartStock(inventory, cartItems)

  function handleOptionChange(menuId, optionId, checked) {
    setSelectedOptions((prev) => {
      const current = prev[menuId] ?? []
      const next = checked
        ? [...current, optionId]
        : current.filter((id) => id !== optionId)

      return { ...prev, [menuId]: next }
    })
  }

  function handleAddToCart(menuId) {
    if (!canAddMenuToCart(inventory, cartItems, menuId)) {
      const stock = getMenuStock(inventory, menuId)
      const menu = menus.find((item) => item.id === menuId)

      if (stock === 0) {
        alert(`${menu?.name ?? '메뉴'}은(는) 품절 상태입니다.`)
      } else {
        alert(`${menu?.name ?? '메뉴'}의 재고가 부족합니다. (재고: ${stock}개)`)
      }
      return
    }

    const menu = menus.find((item) => item.id === menuId)
    if (!menu) return

    const optionIds = [...(selectedOptions[menuId] ?? [])].sort()
    const options = menu.options.filter((option) => optionIds.includes(option.id))
    const unitPrice = calcUnitPrice(menu.price, options)
    const key = getCartKey(menuId, optionIds)

    setCartItems((prev) => {
      const index = prev.findIndex((item) => item.key === key)

      if (index >= 0) {
        return prev.map((item, i) =>
          i === index ? { ...item, quantity: item.quantity + 1 } : item,
        )
      }

      return [
        ...prev,
        {
          key,
          menuId: menu.id,
          menuName: menu.name,
          options,
          unitPrice,
          quantity: 1,
        },
      ]
    })
  }

  function handleOrder() {
    if (cartItems.length === 0) return

    onPlaceOrder(cartItems)
  }

  return (
    <div className="page">
      <Header activePage="order" onNavigate={onNavigate} />

      <div className="app">
        <main className="menu-grid">
          {menus.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              stock={getMenuStock(inventory, menu.id)}
              addDisabled={!canAddMenuToCart(inventory, cartItems, menu.id)}
              selectedOptionIds={selectedOptions[menu.id] ?? []}
              onOptionChange={handleOptionChange}
              onAddToCart={handleAddToCart}
            />
          ))}
        </main>

        <ShoppingCart
          cartItems={cartItems}
          canOrder={cartValidation.valid}
          onOrder={handleOrder}
        />
      </div>
    </div>
  )
}

export default OrderPage
