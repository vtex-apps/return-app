export interface SchedulerBody {
  id?: string
  scheduler: {
    expression: string // '5 4 * * *'
    endDate: string // '2018-11-28T23:29:00'
  }
  request: {
    uri: string // 'http(s)://{{notification.api}}'
    method: string // '{[HTTP method]}'
    body: any
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
}

// eslint-disable-next-line no-restricted-syntax
export enum SchedulerRequestMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
}

export interface CreateSchedulerParams {
  cronId?: string
  cronExpression: string
  request: {
    uri: string
    method: SchedulerRequestMethods
    body: any
  }
}