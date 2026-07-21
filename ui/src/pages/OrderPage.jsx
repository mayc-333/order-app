import { useState } from 'react'
import Header from '../components/Header'
import MenuCard from '../components/MenuCard'
import ShoppingCart from '../components/ShoppingCart'
import { MENUS, OPTIONS } from '../data/menus'
import { calcUnitPrice, getCartKey } from '../utils/cart'

function OrderPage({ onNavigate }) {
  const [selectedOptions, setSelectedOptions] = useState({})
  const [cartItems, setCartItems] = useState([])

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
    const menu = MENUS.find((item) => item.id === menuId)
    if (!menu) return

    const optionIds = [...(selectedOptions[menuId] ?? [])].sort()
    const options = OPTIONS.filter((option) => optionIds.includes(option.id))
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

    const totalAmount = cartItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    )

    // TODO: POST /orders API 연동
    alert(`주문이 완료되었습니다.\n총 금액: ${totalAmount.toLocaleString('ko-KR')}원`)
    setCartItems([])
  }

  return (
    <div className="page">
      <Header activePage="order" onNavigate={onNavigate} />

      <div className="app">
        <main className="menu-grid">
          {MENUS.map((menu) => (
            <MenuCard
              key={menu.id}
              menu={menu}
              selectedOptionIds={selectedOptions[menu.id] ?? []}
              onOptionChange={handleOptionChange}
              onAddToCart={handleAddToCart}
            />
          ))}
        </main>

        <ShoppingCart cartItems={cartItems} onOrder={handleOrder} />
      </div>
    </div>
  )
}

export default OrderPage
