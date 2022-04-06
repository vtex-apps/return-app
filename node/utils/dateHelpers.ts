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
