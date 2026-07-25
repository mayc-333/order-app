import { formatPrice } from '../utils/formatPrice'
import { getQuantityOptions } from '../utils/inventory'

function formatCartItemLabel(item) {
  const optionText =
    item.options.length > 0
      ? ` (${item.options.map((option) => option.name).join(', ')})`
      : ''

  return `${item.menuName}${optionText}`
}

function ShoppingCart({
  cartItems,
  inventory,
  canOrder = true,
  onQuantityChange,
  onOrder,
}) {
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
              {cartItems.map((item) => {
                const quantityOptions = getQuantityOptions(inventory, cartItems, item)

                return (
                  <li key={item.key} className="cart-item">
                    <span className="cart-item-name">{formatCartItemLabel(item)}</span>
                    <select
                      className="cart-item-quantity"
                      value={item.quantity}
                      aria-label={`${item.menuName} 수량`}
                      onChange={(event) =>
                        onQuantityChange(item.key, Number(event.target.value))
                      }
                    >
                      {quantityOptions.map((quantity) => (
                        <option key={quantity} value={quantity}>
                          {quantity}개
                        </option>
                      ))}
                    </select>
                    <span className="cart-item-price">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </span>
                  </li>
                )
              })}
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
