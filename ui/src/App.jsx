import { useCallback, useEffect, useState } from 'react'
import OrderPage from './pages/OrderPage'
import AdminPage from './pages/AdminPage'
import { api } from './api/client'
import { resolveMenuImage } from './utils/menuImages'
import './App.css'

function normalizeOrder(order) {
  return {
    id: order.orderId,
    orderedAt: order.orderedAt,
    totalAmount: order.totalAmount,
    status: order.status,
    items: order.items,
  }
}

function App() {
  const [activePage, setActivePage] = useState('order')
  const [menus, setMenus] = useState([])
  const [orders, setOrders] = useState([])
  const [inventory, setInventory] = useState([])
  const [dashboard, setDashboard] = useState({
    total: 0,
    received: 0,
    preparing: 0,
    completed: 0,
    todayCupsSold: 0,
    yesterdayCupsSold: 0,
    todayDate: new Date().toISOString(),
  })
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const loadOrderPageData = useCallback(async () => {
    const [menusData, inventoryData] = await Promise.all([
      api.getMenus(),
      api.getInventory(),
    ])

    setMenus(
      menusData.map((menu) => ({
        ...menu,
        imageUrl: resolveMenuImage(menu.imageUrl),
      })),
    )
    setInventory(inventoryData)
  }, [])

  const loadAdminPageData = useCallback(async () => {
    const [ordersData, inventoryData, dashboardData] = await Promise.all([
      api.getOrders(),
      api.getInventory(),
      api.getDashboard(),
    ])

    setOrders(ordersData.map(normalizeOrder))
    setInventory(inventoryData)
    setDashboard(dashboardData)
  }, [])

  useEffect(() => {
    async function init() {
      try {
        setLoading(true)
        setError(null)
        await loadOrderPageData()
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [loadOrderPageData])

  useEffect(() => {
    if (activePage !== 'admin') return

    async function loadAdmin() {
      try {
        setError(null)
        await loadAdminPageData()
      } catch (err) {
        setError(err.message)
      }
    }

    loadAdmin()
  }, [activePage, loadAdminPageData])

  async function handlePlaceOrder(items) {
    try {
      const payload = items.map((item) => ({
        menuId: item.menuId,
        quantity: item.quantity,
        optionIds: item.options.map((option) => option.id),
      }))

      const order = await api.createOrder(payload)
      await loadOrderPageData()
      setCartItems([])

      alert(
        `주문이 완료되었습니다.\n총 금액: ${order.totalAmount.toLocaleString('ko-KR')}원`,
      )
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleUpdateStock(menuId, delta) {
    const current = inventory.find((item) => item.menuId === menuId)
    if (!current) return

    const nextStock = Math.max(0, current.stock + delta)

    try {
      const updated = await api.updateInventory(menuId, nextStock)
      setInventory((prev) =>
        prev.map((item) => (item.menuId === menuId ? updated : item)),
      )
    } catch (err) {
      alert(err.message)
    }
  }

  async function handleUpdateOrderStatus(orderId, status) {
    try {
      await api.updateOrderStatus(orderId, status)
      await loadAdminPageData()
    } catch (err) {
      alert(err.message)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <p className="loading-message">로딩 중...</p>
      </div>
    )
  }

  if (error && menus.length === 0) {
    return (
      <div className="page">
        <p className="error-message">{error}</p>
      </div>
    )
  }

  if (activePage === 'order') {
    return (
      <OrderPage
        onNavigate={setActivePage}
        menus={menus}
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
      dashboard={dashboard}
      onUpdateStock={handleUpdateStock}
      onUpdateOrderStatus={handleUpdateOrderStatus}
    />
  )
}

export default App
