/**
 * The report API accepts a string that feeds the masterdata's _WHERE field directly.
 * This function should resolve any desireable filter into it's SQL counterpart.
 * For the moment we only suppport filtering by dates.
 */
export function createExportFilters(
  exportType: ExportFiltersType,
  exportFilters: ExportFiltersData
) {
  if (exportType === 'dates') {
    return `dateSubmitted between ${exportFilters.from.substring(
      0,
      10
    )} AND ${exportFilters.to.substring(0, 10)}`
  }

  return null
}
