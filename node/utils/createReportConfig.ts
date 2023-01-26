import { parseAppId } from '@vtex/api'
import type { ExportReturnRequestsInput } from 'vtex.return-app'

import { localMap } from '../report/json_return-request-map'

const BASE_CONFIG = {
  DELIVERY: {
    /* Not a typo */
    EMAIL: 'EMail',
    NONE: 'None',
    ENDPOINT: 'Endpoint',
  },
  ENTITY: 'vtex_return_app_returnRequest',
  FORMAT: {
    XLSX: 'XLSX',
    JSON: 'JSON',
    CSV: 'CSV',
  },
  TEMPLATE: 'report-report-finished',
} as const

const versionDescriptor = (isProduction: boolean, workspace: string) =>
  isProduction ? '' : `-${workspace}`

/**
 * Creates the data required for the masterdata report api
 * @info For the moment, we only support 'no delivery' and 'email'
 * as delivery options; but can be upgraded to suppport an endpoint call
 */
export const createReportConfig = (
  ctx: Context,
  args: ExportReturnRequestsInput
): MasterdataReportsConfig => {
  const {
    vtex: { production, workspace },
  } = ctx

  const { fileFormat, documentsFilter, deliveryConfiguration } = args

  const app = parseAppId(process.env.VTEX_APP_ID as string)
  const schema = `${app.version}${versionDescriptor(production, workspace)}`

  return {
    mapId: localMap.id,
    mapIds: [localMap.id],
    outputType: fileFormat ?? BASE_CONFIG.FORMAT.XLSX,
    zipped: true,
    where: documentsFilter ?? '',
    entityName: BASE_CONFIG.ENTITY,
    schema,
    queryAllStores: true,
    deliveryConfig: deliveryConfiguration
      ? {
          type: BASE_CONFIG.DELIVERY.EMAIL,
          templateName: BASE_CONFIG.TEMPLATE,
          email: deliveryConfiguration.value,
        }
      : { type: BASE_CONFIG.DELIVERY.NONE },
  }
}
