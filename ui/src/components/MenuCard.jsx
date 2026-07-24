import { OPTIONS } from '../data/menus'
import { formatPrice } from '../utils/formatPrice'

function formatOptionPrice(price) {
  return price > 0 ? `+${formatPrice(price)}` : '+0원'
}

function MenuCard({
  menu,
  stock,
  addDisabled,
  selectedOptionIds,
  onOptionChange,
  onAddToCart,
}) {
  const isSoldOut = stock === 0

  return (
    <article className={`menu-card ${isSoldOut ? 'menu-card--sold-out' : ''}`}>
      <div className="menu-image">
        <img
          src={menu.imageUrl}
          alt={menu.name}
          className="menu-image-photo"
          loading="lazy"
        />
      </div>
      <h2 className="menu-name">{menu.name}</h2>
      <p className="menu-price">{formatPrice(menu.price)}</p>
      <p className="menu-description">{menu.description}</p>

      {isSoldOut && <p className="menu-sold-out-label">품절</p>}

      <div className="menu-options">
        {OPTIONS.map((option) => (
          <label key={option.id} className="option-label">
            <input
              type="checkbox"
              checked={selectedOptionIds.includes(option.id)}
              disabled={addDisabled}
              onChange={(event) =>
                onOptionChange(menu.id, option.id, event.target.checked)
              }
            />
            {option.name} ({formatOptionPrice(option.price)})
          </label>
        ))}
      </div>

      <button
        type="button"
        className="btn btn-primary btn-add"
        disabled={addDisabled}
        onClick={() => onAddToCart(menu.id)}
      >
        {isSoldOut ? '품절' : '담기'}
      </button>
    </article>
  )
}

export default MenuCard
