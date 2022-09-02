import React from 'react'
import { Divider } from 'vtex.styleguide'

import ReportStatus from './ReportStatus'
import ReportForm from './ReportForm'
import { useExportModule } from '../hooks/useExportModule'
import ReportLoader from './ReportLoader'

const ReportContainer = () => {
  const { loadingStatus } = useExportModule()

  if (loadingStatus) {
    return <ReportLoader />
  }

  return (
    <>
      <ReportStatus />
      <div className="mv5">
        <Divider orientation="horizontal" />
      </div>
      <ReportForm />
    </>
  )
}

export default ReportContainer
