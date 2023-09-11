interface SchedulerRequest {
  id: string
  scheduler: {
    expression: string
    endDate: string
  }
  retry: {
    delay: {
      addMinutes: number
      addHours: number
      addDays: number
    }
    times: number
    backOffRate: number
  }
  request: {
    uri: string
    method: string
    headers: { [k: string]: unknown }
    body: { [k: string]: unknown }
  }
}
