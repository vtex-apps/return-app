import type { InstanceOptions, IOContext } from '@vtex/api'
import { IOClient } from '@vtex/api'

import type { CreateSchedulerParams, SchedulerBody } from '../typings/scheduler'

export default class Scheduler extends IOClient {
  private static APP_NAME = `return-app`

  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...(options?.headers ?? {}),
        'Content-Type': 'application/json',
        'X-Vtex-Use-Https': 'true',
        'VtexIdclientAutCookie': context.authToken
      },
    })
  }

  private BASE_URL = `http://${this.context.host}/api/scheduler/${this.context.workspace}/${Scheduler.APP_NAME}/`

  public async getAllCrons(){
    let url = this.BASE_URL+`?version=4`
    return this.http.get(url)
  }

  private getSchedulerUrl(id = '') {
    return this.BASE_URL+`${id}?version=4`
  }

  public async createOrUpdateScheduler(params: CreateSchedulerParams) {
    const { cronExpression, request, cronId } = params

    const schedulerBody: SchedulerBody = {
      id: cronId,
      request,
      scheduler: {
        expression: cronExpression,
        endDate: '2025-01-01T23:30:00',
      },
      retry: {
        delay: {
          addMinutes: 5,
          addHours: 0,
          addDays: 0,
        },
        times: 2,
        backOffRate: 1.0,
      },
    }

    return this.http.put(this.getSchedulerUrl(), schedulerBody)
  }

  public async deleteScheduler(id: string) {
    return this.http.delete(this.getSchedulerUrl(id))
  }
}
