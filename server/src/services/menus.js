import { pool } from '../db/pool.js'

export async function getMenus() {
  const menusResult = await pool.query(`
    SELECT id, name, description, price, image_url AS "imageUrl"
    FROM menus
    ORDER BY id
  `)

  const optionsResult = await pool.query(`
    SELECT id, menu_id AS "menuId", name, price
    FROM options
    ORDER BY menu_id, id
  `)

  const optionsByMenu = optionsResult.rows.reduce((acc, option) => {
    if (!acc[option.menuId]) {
      acc[option.menuId] = []
    }

    acc[option.menuId].push({
      id: option.id,
      name: option.name,
      price: option.price,
    })

    return acc
  }, {})

  return menusResult.rows.map((menu) => ({
    ...menu,
    options: optionsByMenu[menu.id] ?? [],
  }))
}
