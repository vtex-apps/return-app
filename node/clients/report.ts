import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

const baseURL = '/api/report'

const routes = {
  masterdata: `${baseURL}/masterdata`,
  inProgress: `${baseURL}/inprogress`,
  report: (id: string) => `${baseURL}/${id}`,
  map: (id: string) => `${baseURL}/map/${id}`,
}

/**
 * API used to create a complete report of a masterdata entity
 */
export class ReturnRequestReport extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdclientAutCookie: context.authToken,
        ...(options?.headers ?? {}),
      },
    })
  }

  public getMap = (mapId: string) => this.http.get(routes.map(mapId))

  public createOrUpdateMap = (map: ReportMap) =>
    this.http.put<ReportMap>(routes.map(map.id), map)

  public deleteMap = (mapId: string) => this.http.delete(routes.map(mapId))

  public inProgressReports = () =>
    this.http.get<MasterdataReportsResponse[]>(routes.inProgress)

  public getReport = (reportId: string) =>
    this.http.get<Report>(routes.report(reportId))

  public generateReport = (reportConfig: MasterdataReportsConfig) =>
    this.http.post<MasterdataReportsResponse>(routes.masterdata, reportConfig)
}
