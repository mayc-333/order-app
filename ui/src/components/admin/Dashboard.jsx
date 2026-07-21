function Dashboard({ orders }) {
  const stats = {
    total: orders.length,
    received: orders.filter((order) => order.status === 'received').length,
    preparing: orders.filter((order) => order.status === 'preparing').length,
    completed: orders.filter((order) => order.status === 'completed').length,
  }

  return (
    <section className="admin-section">
      <h2 className="admin-section-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        <div className="dashboard-stat">
          <span className="dashboard-stat-label">총 주문</span>
          <span className="dashboard-stat-value">{stats.total}</span>
        </div>
        <div className="dashboard-stat">
          <span className="dashboard-stat-label">주문 접수</span>
          <span className="dashboard-stat-value">{stats.received}</span>
        </div>
        <div className="dashboard-stat">
          <span className="dashboard-stat-label">제조 중</span>
          <span className="dashboard-stat-value">{stats.preparing}</span>
        </div>
        <div className="dashboard-stat">
          <span className="dashboard-stat-label">제조 완료</span>
          <span className="dashboard-stat-value">{stats.completed}</span>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
