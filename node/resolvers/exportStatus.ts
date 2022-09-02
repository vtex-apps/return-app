import type { ExportReportData } from 'vtex.return-app'

import { exportStatusService } from '../services/exportStatusService'

export const exportStatus = async (
  _: unknown,
  __: unknown,
  ctx: Context
): Promise<ExportReportData | null> => {
  return exportStatusService(ctx)
}
