import { ResolverError } from '@vtex/api'
import type { ExportReportData } from 'vtex.return-app'

import { EXPORT_DATA_PATH } from '../utils/constants'
import { isReportStale } from '../utils/dateHelpers'

export const exportStatusService = async (
  ctx: Context
): Promise<ExportReportData | null> => {
  const {
    clients: { report: returnRequestReport, exportReport },
  } = ctx

  const reportReference = await exportReport.get(EXPORT_DATA_PATH, true)

  if (!reportReference?.id) {
    return null
  }

  const { id, selectedFilters, requestedBy } = reportReference

  try {
    const report = await returnRequestReport.getReport(id)
    const {
      finished,
      linkToDownload,
      completedDate,
      lastErrorMessage,
      percentageProcessed,
    } = report

    /**
     * @bug
     * A report can be in progress but completed and available.
     * The reason is unknown, so we still allow the user to download the file
     */
    const reportCompleted =
      Boolean(linkToDownload) && percentageProcessed === 100

    return {
      id,
      inProgress: !reportCompleted ?? finished === false,
      percentageProcessed,
      requestedBy: requestedBy ?? 'unknown',
      completedDate,
      selectedFilters: selectedFilters ?? null,
      downloadLink: linkToDownload,
      staleLink: linkToDownload ? isReportStale(completedDate) : null,
      lastErrorMessage,
    }
  } catch (error) {
    throw new ResolverError(
      `An unexpected error ocurred while requesting export status: ${error.message}`
    )
  }
}
