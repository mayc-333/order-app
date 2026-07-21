export const ORDER_STATUS = {
  RECEIVED: 'received',
  PREPARING: 'preparing',
  COMPLETED: 'completed',
}

export const ORDER_STATUS_LABEL = {
  received: '주문 접수',
  preparing: '제조 중',
  completed: '제조 완료',
}

export const ORDER_ACTION_LABEL = {
  received: '제조 시작',
  preparing: '제조 완료',
}

export function getNextStatus(status) {
  if (status === ORDER_STATUS.RECEIVED) return ORDER_STATUS.PREPARING
  if (status === ORDER_STATUS.PREPARING) return ORDER_STATUS.COMPLETED
  return null
}
