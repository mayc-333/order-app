import Header from '../components/Header'
import Dashboard from '../components/admin/Dashboard'
import InventorySection from '../components/admin/InventorySection'
import OrderList from '../components/admin/OrderList'

function AdminPage({
  onNavigate,
  orders,
  inventory,
  dashboard,
  onUpdateStock,
  onUpdateOrderStatus,
}) {
  return (
    <div className="page">
      <Header activePage="admin" onNavigate={onNavigate} />

      <div className="app admin-page">
        <Dashboard stats={dashboard} />
        <InventorySection
          inventory={inventory}
          onIncrease={(menuId) => onUpdateStock(menuId, 1)}
          onDecrease={(menuId) => onUpdateStock(menuId, -1)}
        />
        <OrderList orders={orders} onUpdateStatus={onUpdateOrderStatus} />
      </div>
    </div>
  )
}

export default AdminPage
