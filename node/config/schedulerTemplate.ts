export const schedulerTemplate = {
  id: 'TO_BE_REPLACED',
  scheduler: {
    expression: '1 0 * * *',
    endDate: '2029-12-30T23:29:00',
  },
  retry: {
    delay: {
      addMinutes: 5,
      addHours: 0,
      addDays: 0,
    },
    times: 2,
    backOffRate: 1,
  },
  request: {
    uri: '',
    method: 'POST',
    headers: {},
    body: {},
  },
}
