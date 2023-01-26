import { ResolverError, UserInputError } from '@vtex/api'
import type {
  ExportReturnRequestsInput,
  ExportReportData,
} from 'vtex.return-app'

import { verifyReportMap } from '../utils/verifyReportMap'
import { EXPORT_DATA_PATH } from '../utils/constants'
import { createReportConfig } from '../utils/createReportConfig'

export const exportReturnRequestsService = async (
  ctx: Context,
  args: ExportReturnRequestsInput
): Promise<ExportReportData> => {
  const {
    state: { userProfile },
    clients: { report: returnRequestReport, exportReport },
  } = ctx

  if (!args.fileFormat || args.fileFormat !== 'XLSX') {
    throw new UserInputError(
      'File format not supported or specified. Supported formats: XLSX'
    )
  }

  /* If the MAP is missing/outdated we update it from our local map found in ../report */
  await verifyReportMap(returnRequestReport)

  /* Creates the Report api body needed */
  const reportConfig = createReportConfig(ctx, args)

  try {
    const report = await returnRequestReport.generateReport(reportConfig)
    const {
      id,
      finished,
      linkToDownload,
      lastErrorMessage,
      percentageProcessed,
      completedDate,
    } = report

    const documentsFilter = args.documentsFilter ?? null

    await exportReport.save(EXPORT_DATA_PATH, {
      id,
      selectedFilters: documentsFilter,
      requestedBy: userProfile?.email ?? null,
    })

    return {
      id,
      inProgress: !finished,
      percentageProcessed,
      requestedBy: userProfile?.email ?? null,
      completedDate,
      selectedFilters: documentsFilter,
      downloadLink: linkToDownload,
      staleLink: false,
      lastErrorMessage,
    }
  } catch (error) {
    throw new ResolverError(
      `An unexpected error ocurred while requesting a new report: ${error.message}`
    )
  }
}
