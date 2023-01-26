import type {
  MutationExportReturnRequestsArgs,
  ExportReportData,
} from 'vtex.return-app'

import { exportReturnRequestsService } from '../services/exportReturnRequestsService'

export const exportReturnRequests = async (
  _: unknown,
  args: MutationExportReturnRequestsArgs,
  ctx: Context
): Promise<ExportReportData> => {
  const { exportData } = args

  return exportReturnRequestsService(ctx, exportData)
}
