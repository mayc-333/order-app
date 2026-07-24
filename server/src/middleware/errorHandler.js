import { AppError, sendError } from '../utils/errors.js'

export function errorHandler(error, _req, res, _next) {
  if (error instanceof AppError) {
    return sendError(res, error.status, error.message, error.code)
  }

  console.error(error)
  sendError(res, 500, '서버 내부 오류가 발생했습니다.', 'INTERNAL_ERROR')
}
