import React from 'react'
import { ButtonPlain, IconExternalLink } from 'vtex.styleguide'

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
      <p className="f4 mt2 mb3">Last report</p>
      <div className="flex items-center justify-between">
        <p className="mv3">
          <ButtonPlain
            variation="plain"
            href={downloadLink ?? null}
            disabled={inProgress || !downloadLink || staleLink}
            target="_blank"
          >
            Download link&nbsp;
            <IconExternalLink />
          </ButtonPlain>
        </p>
        <p className="mv3">
          <TagStatus />
        </p>
      </div>
      <p className="mv3">
        <span className="fw5">Requested by: </span>
        <span>{requestedBy ?? 'N/A'}</span>
      </p>
      <p className="mv3">
        <span className="fw5">Start date: </span>
        <span>
          {completedDate ? new Date(completedDate).toLocaleString() : 'N/A'}
        </span>
      </p>
      <p className="mv3">
        <span className="fw5">Filter range: </span>
        <span>{selectedFilters ?? 'N/A'}</span>
      </p>
    </>
  )
}

export default ReportStatus
