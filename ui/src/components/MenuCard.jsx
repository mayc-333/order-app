import { OPTIONS } from '../data/menus'
import { formatPrice } from '../utils/formatPrice'

function MenuCard({ menu, selectedOptionIds, onOptionChange, onAddToCart }) {
  return (
    <article className="menu-card">
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

      <div className="menu-options">
        {OPTIONS.map((option) => (
          <label key={option.id} className="option-label">
            <input
              type="checkbox"
              checked={selectedOptionIds.includes(option.id)}
              onChange={(event) =>
                onOptionChange(menu.id, option.id, event.target.checked)
              }
            />
            {option.name} ({option.price > 0 ? `+${formatPrice(option.price)}` : '+0원'})
          </label>
        ))}
      </div>

      <button type="button" className="btn btn-primary btn-add" onClick={() => onAddToCart(menu.id)}>
        담기
      </button>
    </article>
  )
}

export default MenuCard
