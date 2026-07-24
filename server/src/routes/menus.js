import { Router } from 'express'
import { asyncHandler } from '../utils/asyncHandler.js'
import { getMenus } from '../services/menus.js'

const router = Router()

router.get(
  '/',
  asyncHandler(async (_req, res) => {
    const menus = await getMenus()
    res.json(menus)
  }),
)

export default router
