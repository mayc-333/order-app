import { getStockStatus } from '../../utils/stockStatus'

function InventoryCard({ item, onIncrease, onDecrease }) {
  const status = getStockStatus(item.stock)

  return (
    <article className="inventory-card">
      <h3 className="inventory-name">{item.menuName}</h3>
      <div className="inventory-info">
        <p className="inventory-stock">{item.stock}개</p>
        <span className={`inventory-status ${status.className}`}>{status.label}</span>
      </div>

      <div className="inventory-controls">
        <button
          type="button"
          className="btn btn-outline inventory-btn"
          onClick={() => onDecrease(item.menuId)}
          disabled={item.stock === 0}
          aria-label={`${item.menuName} 재고 감소`}
        >
          −
        </button>
        <button
          type="button"
          className="btn btn-outline inventory-btn"
          onClick={() => onIncrease(item.menuId)}
          aria-label={`${item.menuName} 재고 증가`}
        >
          +
        </button>
      </div>
    </article>
  )
}

function InventorySection({ inventory, onIncrease, onDecrease }) {
  return (
    <section className="admin-section">
      <h2 className="admin-section-title">재고 현황</h2>
      <div className="inventory-grid">
        {inventory.map((item) => (
          <InventoryCard
            key={item.menuId}
            item={item}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
          />
        ))}
      </div>
    </section>
  )
}

export default InventorySection
