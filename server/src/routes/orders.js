import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { sendError } from '../utils/errors.js'
import { createOrder, getOrderById } from '../services/orders.js'

const router = Router()

router.post(
  '/',
  asyncHandler(async (req, res) => {
    const order = await createOrder(req.body.items)
    res.status(201).json(order)
  }),
)

router.get(
  '/:orderId',
  asyncHandler(async (req, res) => {
    const orderId = Number(req.params.orderId)

    if (!Number.isInteger(orderId) || orderId < 1) {
      return sendError(res, 400, '잘못된 주문 ID입니다.', 'INVALID_ORDER_ID')
    }

    const order = await getOrderById(orderId)

    if (!order) {
      return sendError(res, 404, '주문을 찾을 수 없습니다.', 'ORDER_NOT_FOUND')
    }

    res.json(order)
  }),
)

export default router
