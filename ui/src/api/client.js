const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error ?? '요청에 실패했습니다.')
  }

  return data
}

export const api = {
  getMenus() {
    return request('/menus')
  },

  createOrder(items) {
    return request('/orders', {
      method: 'POST',
      body: JSON.stringify({ items }),
    })
  },

  getInventory() {
    return request('/admin/inventory')
  },

  updateInventory(menuId, stock) {
    return request(`/admin/inventory/${menuId}`, {
      method: 'PATCH',
      body: JSON.stringify({ stock }),
    })
  },

  getOrders() {
    return request('/admin/orders')
  },

  updateOrderStatus(orderId, status) {
    return request(`/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
  },

  getDashboard() {
    return request('/admin/dashboard')
  },
}
