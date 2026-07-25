import {
  formatDashboardDate,
  formatSalesComparison,
} from '../../utils/dashboard'

function Dashboard({ stats }) {
  const dateLabel = formatDashboardDate(stats.todayDate)
  const todayCupsSold = stats.todayCupsSold ?? 0
  const yesterdayCupsSold = stats.yesterdayCupsSold ?? 0
  const comparisonText = formatSalesComparison(todayCupsSold, yesterdayCupsSold)
  const diff = todayCupsSold - yesterdayCupsSold
  const comparisonClass =
    diff > 0 ? 'up' : diff < 0 ? 'down' : 'same'

  return (
    <section className="admin-section">
      <h2 className="admin-section-title">관리자 대시보드</h2>
      <div className="dashboard-stats">
        <div className="dashboard-stat dashboard-stat--highlight">
          <span className="dashboard-stat-label">{dateLabel}</span>
          <span className="dashboard-stat-value">{todayCupsSold}잔</span>
          <span className={`dashboard-stat-compare dashboard-stat-compare--${comparisonClass}`}>
            {comparisonText}
          </span>
        </div>
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
