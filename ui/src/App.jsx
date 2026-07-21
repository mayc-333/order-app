import { useState } from 'react'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import { MENUS } from './data/menus'
import { ORDER_STATUS } from './utils/orderStatus'
import { validateCartStock } from './utils/inventory'
import './App.css'

function createInitialInventory() {
  return MENUS.map((menu) => ({
    menuId: menu.id,
    menuName: menu.name,
    stock: 10,
  }))
}

function App() {
  const [activePage, setActivePage] = useState('order')
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState(createInitialInventory)
  const [cartItems, setCartItems] = useState([])
  const [nextOrderId, setNextOrderId] = useState(1)

  function handlePlaceOrder(items) {
    const validation = validateCartStock(inventory, items)

    if (!validation.valid) {
      alert(validation.message)
      return
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    )

    setOrders((prev) => [
      {
        id: nextOrderId,
        orderedAt: new Date().toISOString(),
        items: items.map((item) => ({
          menuId: item.menuId,
          menuName: item.menuName,
          options: item.options,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
        })),
        totalAmount,
        status: ORDER_STATUS.RECEIVED,
      },
      ...prev,
    ])
    setNextOrderId((prev) => prev + 1)
    setCartItems([])

    alert(`주문이 완료되었습니다.\n총 금액: ${totalAmount.toLocaleString('ko-KR')}원`)
  }

  function handleUpdateStock(menuId, delta) {
    setInventory((prev) =>
      prev.map((item) => {
        if (item.menuId !== menuId) return item

        const nextStock = Math.max(0, item.stock + delta)
        return { ...item, stock: nextStock }
      }),
    )
  }

  function handleUpdateOrderStatus(orderId, status) {
    setOrders((prev) =>
      prev.map((order) => (order.id === orderId ? { ...order, status } : order)),
    )
  }

  if (activePage === 'order') {
    return (
      <OrderPage
        onNavigate={setActivePage}
        inventory={inventory}
        cartItems={cartItems}
        setCartItems={setCartItems}
        onPlaceOrder={handlePlaceOrder}
      />
    )
  }

  return (
    <AdminPage
      onNavigate={setActivePage}
      orders={orders}
      inventory={inventory}
      onUpdateStock={handleUpdateStock}
      onUpdateOrderStatus={handleUpdateOrderStatus}
    />
  )
}

export default App
