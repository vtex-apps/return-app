import React from 'react'
import { ButtonPlain, IconExternalLink } from 'vtex.styleguide'
import { FormattedMessage, FormattedDate } from 'react-intl'

import { useExportModule } from '../hooks/useExportModule'
import TagStatus from './TagStatus'

const ReportStatus = () => {
  const { exportStatus } = useExportModule()

  const {
    inProgress,
    requestedBy,
    completedDate,
    selectedFilters,
    downloadLink,
    staleLink,
  } = exportStatus ?? {}

  return (
    <>
      <p className="f4 mt2 mb3">
        <FormattedMessage id="admin/return-app.export-module.report.status-title" />
      </p>
      <div className="flex items-center justify-between">
        <p className="mv3">
          <ButtonPlain
            variation="plain"
            href={downloadLink ?? null}
            disabled={inProgress || !downloadLink || staleLink}
            target="_blank"
          >
            <FormattedMessage id="admin/return-app.export-module.report.download-cta" />
            &nbsp;
            <IconExternalLink />
          </ButtonPlain>
        </p>
        <span className="mv3">
          <TagStatus />
        </span>
      </div>
      <p className="mv3">
        <span className="fw5">
          <FormattedMessage id="admin/return-app.export-module.report.status-requestedBy" />
          &nbsp;
        </span>
        {requestedBy ?? 'N/A'}
      </p>
      <p className="mv3">
        <span className="fw5">
          <FormattedMessage id="admin/return-app.export-module.report.status-completedDate" />
          &nbsp;
        </span>
        {completedDate ? (
          <FormattedDate
            value={completedDate}
            day="2-digit"
            month="2-digit"
            year="numeric"
            hour="numeric"
            minute="numeric"
            second="numeric"
          />
        ) : (
          'N/A'
        )}
      </p>
      <p className="mv3">
        <span className="fw5">
          <FormattedMessage id="admin/return-app.export-module.report.status-filterRange" />
          &nbsp;
        </span>
        {selectedFilters ?? 'N/A'}
      </p>
    </>
  )
}

export default ReportStatus
