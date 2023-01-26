export const getCurrentDate = () => new Date().toISOString()

export const substractDays = (currentDate: string, maxDays: number) => {
  const date = new Date(currentDate)

  date.setDate(date.getDate() - maxDays)
  date.setUTCHours(0, 0, 0)

  return date.toISOString()
}

export const isWithinMaxDaysToReturn = (
  orderCreationDate: string,
  maxDays: number
) => {
  const currentDate = getCurrentDate()

  const limitDateToReturn = substractDays(currentDate, maxDays)

  return new Date(orderCreationDate) > new Date(limitDateToReturn)
}

/**
 * Compares a given ISO date vs today
 * @returns if the report download link expired after 6 hours
 */
export const isReportStale = (completedDate: string | null) => {
  if (!completedDate) return null

  const today = new Date()
  const completed = new Date(completedDate)

  const difference = (today.getTime() - completed.getTime()) / 3600000

  if (difference > 6) {
    return true
  }

  return false
}
