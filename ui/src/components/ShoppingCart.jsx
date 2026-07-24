import { formatPrice } from '../utils/formatPrice'

function formatCartItemLabel(item) {
  const optionText =
    item.options.length > 0
      ? ` (${item.options.map((option) => option.name).join(', ')})`
      : ''

  return `${item.menuName}${optionText} X ${item.quantity}`
}

function ShoppingCart({ cartItems, canOrder = true, onOrder }) {
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  )
  const isEmpty = cartItems.length === 0

  return (
    <section className="cart">
      <h2 className="cart-title">장바구니</h2>

      <div className="cart-body">
        <div className="cart-orders">
          {isEmpty ? (
            <p className="cart-empty">장바구니가 비어 있습니다</p>
          ) : (
            <ul className="cart-items">
              {cartItems.map((item) => (
                <li key={item.key} className="cart-item">
                  <span className="cart-item-name">{formatCartItemLabel(item)}</span>
                  <span className="cart-item-price">
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="cart-checkout">
          <p className="cart-total">총 금액 {formatPrice(totalAmount)}</p>
          <button
            type="button"
            className="btn btn-primary btn-order"
            disabled={isEmpty || !canOrder}
            onClick={onOrder}
          >
            주문하기
          </button>
        </div>
      </div>
    </section>
  )
}

export default ShoppingCart
