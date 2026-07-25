export function formatDashboardDate(dateValue) {
  if (dateValue) {
    const datePart = String(dateValue).slice(0, 10)
    const match = datePart.match(/^(\d{4})-(\d{2})-(\d{2})$/)

    if (match) {
      const month = Number(match[2])
      const day = Number(match[3])
      return `${month}월 ${day}일`
    }
  }

  const now = new Date()
  return `${now.getMonth() + 1}월 ${now.getDate()}일`
}

export function formatSalesComparison(todayCupsSold = 0, yesterdayCupsSold = 0) {
  const diff = todayCupsSold - yesterdayCupsSold

  if (diff > 0) {
    return `어제 ${yesterdayCupsSold}잔 대비 +${diff}잔`
  }

  if (diff < 0) {
    return `어제 ${yesterdayCupsSold}잔 대비 ${diff}잔`
  }

  return `어제와 동일 (${yesterdayCupsSold}잔)`
}
