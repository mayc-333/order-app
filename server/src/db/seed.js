const menus = [
  {
    name: '아메리카노(ICE)',
    description: '시원하고 깔끔한 아이스 아메리카노',
    price: 4000,
    imageUrl: '/images/americano-ice.jpg',
    stock: 10,
  },
  {
    name: '아메리카노(HOT)',
    description: '진한 에스presso의 깊은 풍미',
    price: 4000,
    imageUrl: '/images/americano-hot.jpg',
    stock: 10,
  },
  {
    name: '카페라떼',
    description: '부드러운 우유와 에스presso의 조화',
    price: 5000,
    imageUrl: '/images/cafe-latte.jpg',
    stock: 10,
  },
]

const commonOptions = [
  { name: '샷 추가', price: 500 },
  { name: '시럽 추가', price: 0 },
]

export async function seedDatabase(client) {
  const { rows } = await client.query('SELECT COUNT(*)::INT AS count FROM menus')

  if (rows[0].count > 0) {
    return false
  }

  for (const menu of menus) {
    const menuResult = await client.query(
      `INSERT INTO menus (name, description, price, image_url, stock)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [menu.name, menu.description, menu.price, menu.imageUrl, menu.stock],
    )

    const menuId = menuResult.rows[0].id

    for (const option of commonOptions) {
      await client.query(
        `INSERT INTO options (menu_id, name, price)
         VALUES ($1, $2, $3)`,
        [menuId, option.name, option.price],
      )
    }
  }

  return true
}
