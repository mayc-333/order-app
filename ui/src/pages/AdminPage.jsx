import Header from '../components/Header'
import Dashboard from '../components/admin/Dashboard'
import InventorySection from '../components/admin/InventorySection'
import OrderList from '../components/admin/OrderList'

function AdminPage({ onNavigate, orders, inventory, onUpdateStock, onUpdateOrderStatus }) {
  function handleIncrease(menuId) {
    onUpdateStock(menuId, 1)
  }

  function handleDecrease(menuId) {
    onUpdateStock(menuId, -1)
  }

  return (
    <div className="page">
      <Header activePage="admin" onNavigate={onNavigate} />

      <div className="app admin-page">
        <Dashboard orders={orders} />
        <InventorySection
          inventory={inventory}
          onIncrease={handleIncrease}
          onDecrease={handleDecrease}
        />
        <OrderList orders={orders} onUpdateStatus={onUpdateOrderStatus} />
      </div>
    </div>
  )
}

export default AdminPage
