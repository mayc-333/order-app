import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendError } from '../utils/errors.js'
import {
  getAdminOrders,
  getDashboardStats,
  getInventory,
  updateInventory,
  updateOrderStatus,
} from '../services/admin.js'

const router = Router()

router.get(
  '/dashboard',
  asyncHandler(async (_req, res) => {
    const stats = await getDashboardStats()
    res.json(stats)
  }),
)

router.get(
  '/inventory',
  asyncHandler(async (_req, res) => {
    const inventory = await getInventory()
    res.json(inventory)
  }),
)

router.patch(
  '/inventory/:menuId',
  asyncHandler(async (req, res) => {
    const menuId = Number(req.params.menuId)

    if (!Number.isInteger(menuId) || menuId < 1) {
      return sendError(res, 400, '잘못된 메뉴 ID입니다.', 'INVALID_MENU_ID')
    }

    if (req.body.stock === undefined) {
      return sendError(res, 400, 'stock 값이 필요합니다.', 'INVALID_REQUEST')
    }

    const inventory = await updateInventory(menuId, req.body.stock)
    res.json(inventory)
  }),
)

router.get(
  '/orders',
  asyncHandler(async (_req, res) => {
    const orders = await getAdminOrders()
    res.json(orders)
  }),
)

router.patch(
  '/orders/:orderId/status',
  asyncHandler(async (req, res) => {
    const orderId = Number(req.params.orderId)

    if (!Number.isInteger(orderId) || orderId < 1) {
      return sendError(res, 400, '잘못된 주문 ID입니다.', 'INVALID_ORDER_ID')
    }

    if (!req.body.status) {
      return sendError(res, 400, 'status 값이 필요합니다.', 'INVALID_REQUEST')
    }

    const order = await updateOrderStatus(orderId, req.body.status)
    res.json(order)
  }),
)

export default router
