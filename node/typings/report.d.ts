interface Report {
  canceled: boolean
  completedDate: string | null
  email: string
  enqueueDate: string
  finished: boolean
  id: string
  lastUpdateTime: string | null
  linkToDownload: string | null
  outputType: string
  recordsProcessed: number | null
  percentageProcessed: number
  recordsSum: number | null
  startDate: string | null
  zipped: boolean
  lastErrorMessage: string | null
  deliveredDate: string | null
  language: string | null
  utcTime: string | null
  deliveryConfig: DeliveryConfig
}

interface ReportField {
  header: string
  query: string
  usePath: boolean
  translationPrefix: string | null
  defaultLanguage: string | null
}

interface ReportMap {
  id: string
  isGlobal: boolean
  path: string
  name: string
  skipRecordOnError: boolean
  domain: string | null
  columns: ReportField[]
}

interface DeliveryEndpoint {
  endpoint: string
  type: 'Endpoint'
}

interface DeliveryEmail {
  templateName: string
  email: string
  /* Not a typo */
  type: 'EMail'
}

interface DeliveryNone {
  type: 'None'
}

type ReportOutput = 'XLSX' | 'CSV' | 'JSON'

type DeliveryConfig = DeliveryNone | DeliveryEmail | DeliveryEndpoint

interface MasterdataReportsConfig {
  mapId: string
  mapIds: string[]
  where: string
  outputType: ReportOutput
  zipped: boolean
  entityName: string
  schema: string
  queryAllStores: boolean
  deliveryConfig: DeliveryConfig
}

interface MasterdataReportsResponse {
  canceled: boolean
  completedDate: string
  email: string
  enqueueDate: string
  finished: boolean
  id: string
  lastUpdateTime: string
  linkToDownload: string
  outputType: string
  percentageProcessed: number
  recordsSum: number
  startDate: string
  zipped: boolean
  lastErrorMessage: string
  deliveryConfig: DeliveryConfig
}
