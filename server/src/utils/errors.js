export class AppError extends Error {
  constructor(status, message, code) {
    super(message)
    this.status = status
    this.code = code
  }
}

export function sendError(res, status, message, code) {
  res.status(status).json({ error: message, code })
}
