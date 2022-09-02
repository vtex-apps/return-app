import React, { useState } from 'react'
import type { FormEvent } from 'react'
import {
  Button,
  DatePicker,
  Input,
  IconUser,
  Dropdown,
  Toggle,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import type { ExportReturnRequestsInput } from 'vtex.return-app'

import { useExportModule } from '../hooks/useExportModule'
import { SUPPORTED_REPORT_FORMATS } from '../../../common/constants/returnsRequest'
import { createExportFilters } from '../../../utils/createExportFilters'

const supportedOptions = SUPPORTED_REPORT_FORMATS.map((format) => {
  return { value: format, label: format }
})

const initialFilters = {
  from: '',
  to: '',
} as ExportDateFilters

type SupportedFilters = 'from' | 'to' | 'email'

const ReportForm = () => {
  const [exportAll, setExportPreference] = useState(true)
  const [dateFilters, setFilters] = useState(initialFilters)
  const [sendEmail, setEmailPreference] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState('')

  const { exportStatus, _handleExport, submitInProgress } = useExportModule()

  const { inProgress, lastErrorMessage } = exportStatus ?? {}

  const retryAvailable = inProgress && lastErrorMessage

  const fromDate = dateFilters.from ? new Date(dateFilters.from) : ''
  const toDate = dateFilters.to ? new Date(dateFilters.to) : ''

  const missingInputs =
    (!exportAll && !fromDate) || (sendEmail && !recipientEmail)

  const handleOnChange = (key: SupportedFilters, value: string) => {
    if (key === 'to' || key === 'from') {
      const filterDates = {
        ...dateFilters,
        [key]: value,
      }

      if (!filterDates.to) {
        filterDates.to = new Date().toISOString()
      }

      if (!filterDates.from) {
        filterDates.from = new Date(filterDates.to).toISOString()
      }

      setFilters({
        ...filterDates,
      })
    }

    if (key === 'email') {
      setRecipientEmail(value)
    }
  }

  const handleSubmit = () => {
    const exportData = {
      fileFormat: 'XLSX',
      documentsFilter: exportAll
        ? null
        : createExportFilters('dates', dateFilters),
      deliveryConfiguration: sendEmail
        ? {
            type: 'EMAIL',
            value: recipientEmail,
          }
        : null,
    } as ExportReturnRequestsInput

    _handleExport(exportData)
  }

  return (
    <>
      <p className="f4 mt2">
        <FormattedMessage id="admin/return-app.export-module.report.form-title" />
      </p>
      <div className="w-100 mb6 mt3">
        <Dropdown
          size="small"
          disabled
          options={supportedOptions}
          value="XLSX"
        />
      </div>
      <Toggle
        label={
          <FormattedMessage id="admin/return-app.export-module.report.form-allRequests-toggle" />
        }
        checked={exportAll}
        onChange={() => setExportPreference(!exportAll)}
      />
      <div className="w-100 mv3">
        <FormattedMessage id="return-app.return-request-list.table-filters.fromDate">
          {(formattedMessage) => (
            <DatePicker
              maxDate={new Date()}
              placeholder={formattedMessage}
              locale="en-GB"
              size="small"
              onChange={(date: Date) =>
                handleOnChange('from', new Date(date).toISOString())
              }
              value={fromDate}
              disabled={exportAll}
            />
          )}
        </FormattedMessage>
      </div>
      <div className="w-100 mt3 mb6">
        <FormattedMessage id="return-app.return-request-list.table-filters.toDate">
          {(formattedMessage) => (
            <DatePicker
              maxDate={new Date()}
              placeholder={formattedMessage}
              locale="en-GB"
              size="small"
              onChange={(date: Date) =>
                handleOnChange('to', new Date(date).toISOString())
              }
              value={toDate}
              disabled={exportAll}
            />
          )}
        </FormattedMessage>
      </div>
      <FormattedMessage id="admin/return-app.export-module.report.form-email-toggle">
        {(formattedMessage) => (
          <Toggle
            label={formattedMessage}
            checked={sendEmail}
            onChange={() => setEmailPreference(!sendEmail)}
          />
        )}
      </FormattedMessage>
      <div className="w-100 mv3">
        <FormattedMessage id="admin/return-app.export-module.report.form-email-placeholder">
          {(formattedMessage) => (
            <Input
              size="small"
              placeholder={formattedMessage}
              prefix={<IconUser />}
              disabled={!sendEmail}
              onChange={(e: FormEvent<HTMLInputElement>) =>
                handleOnChange('email', e.currentTarget.value)
              }
            />
          )}
        </FormattedMessage>
      </div>
      <div className="w-100 mv4 flex justify-end">
        <Button
          variation="primary"
          size="small"
          onClick={handleSubmit}
          isLoading={submitInProgress}
          disabled={retryAvailable || inProgress || missingInputs}
        >
          <FormattedMessage id="admin/return-app.export-module.report.form-cta" />
        </Button>
      </div>
    </>
  )
}

export default ReportForm
