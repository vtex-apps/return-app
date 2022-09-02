import React from 'react'
import { Tag, Spinner } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import { useExportModule } from '../hooks/useExportModule'
import { TAG_STATUSES } from '../provider/ExportProvider'

const TagStatus = () => {
  const { exportStatus, tagStatus } = useExportModule()

  const { percentageProcessed } = exportStatus ?? {}

  /* Parts of the report api flow are the 'Delivery' and 'Merge' stages.
  This can represent 100% records processed, but not that the report is finished.
  Representing 100% in the UI is not intuitive */
  const maxPercievedPercentage =
    Boolean(percentageProcessed) && percentageProcessed === 100
      ? 99
      : percentageProcessed

  switch (tagStatus) {
    case TAG_STATUSES.ERROR:
      return (
        <Tag type="error">
          <FormattedMessage id="admin/return-app.export-module.report.status-tag.error" />
        </Tag>
      )

    case TAG_STATUSES.INPROGRESS:
      return (
        <Tag type="warning">
          <span className="flex items-center">
            <Spinner color="#ffffff" size={12} />
            &nbsp;
            <FormattedMessage id="admin/return-app.export-module.report.status-tag.inProgress" />
            &nbsp;
            {maxPercievedPercentage ? ~~maxPercievedPercentage : 0}%
          </span>
        </Tag>
      )

    default:
    case TAG_STATUSES.READY:
      return (
        <Tag type="success">
          <FormattedMessage id="admin/return-app.export-module.report.status-tag.ready" />
        </Tag>
      )
  }
}

export default TagStatus
