import { formatOrderDate, formatOrderItem } from '../../utils/formatOrder'
import { formatPrice } from '../../utils/formatPrice'
import {
  ORDER_ACTION_LABEL,
  ORDER_STATUS_LABEL,
  getNextStatus,
} from '../../utils/orderStatus'

function OrderList({ orders, onUpdateStatus }) {
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.orderedAt) - new Date(a.orderedAt),
  )

  return (
    <section className="admin-section">
      <h2 className="admin-section-title">주문 현황</h2>

      {sortedOrders.length === 0 ? (
        <p className="order-empty">접수된 주문이 없습니다</p>
      ) : (
        <ul className="order-list">
          {sortedOrders.map((order) => {
            const nextStatus = getNextStatus(order.status)
            const actionLabel = nextStatus ? ORDER_ACTION_LABEL[order.status] : null

            return (
              <li key={order.id} className={`order-item order-item--${order.status}`}>
                <div className="order-item-main">
                  <time className="order-date">{formatOrderDate(order.orderedAt)}</time>
                  <div className="order-details">
                    {order.items.map((item, index) => (
                      <p key={`${order.id}-${index}`} className="order-menu">
                        {formatOrderItem(item)}
                      </p>
                    ))}
                  </div>
                  <span className="order-amount">{formatPrice(order.totalAmount)}</span>
                </div>

                <div className="order-item-action">
                  <span className={`order-status-badge order-status-badge--${order.status}`}>
                    {ORDER_STATUS_LABEL[order.status]}
                  </span>
                  {actionLabel && (
                    <button
                      type="button"
                      className="btn btn-primary btn-status"
                      onClick={() => onUpdateStatus(order.id, nextStatus)}
                    >
                      {actionLabel}
                    </button>
                  )}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

export default OrderList
