import type { FormEvent, ChangeEvent } from 'react'
import React, { useState } from 'react'
import type { IntlFormatters } from 'react-intl'
import { FormattedMessage, useIntl } from 'react-intl'
import { Dropdown, Textarea, Checkbox, Button } from 'vtex.styleguide'
import type { Status } from 'vtex.return-app'

import { useReturnDetails } from '../../hooks/useReturnDetails'

const statusAllowed: Record<Status, Status[]> = {
  new: ['new', 'processing', 'denied'],
  processing: ['processing', 'pickedUpFromClient', 'denied'],
  pickedUpFromClient: ['pickedUpFromClient', 'pendingVerification', 'denied'],
  // In this step, when sending the items to the resolver, it will assign the status denied or packageVerified based on the items sent.
  pendingVerification: ['pendingVerification'],
  packageVerified: ['packageVerified', 'amountRefunded'],
  amountRefunded: ['amountRefunded'],
  denied: ['denied'],
}

const statusMessageId: Record<Status, string> = {
  new: 'admin/return-app-status.new',
  processing: 'admin/return-app-status.processing',
  pickedUpFromClient: 'admin/return-app-status.pickedup-from-client',
  pendingVerification: 'admin/return-app-status.pending-verification',
  packageVerified: 'admin/return-app-status.package-verified',
  amountRefunded: 'admin/return-app-status.refunded',
  denied: 'admin/return-app-status.denied',
}

const createStatusOptions = (
  currentStatus: Status,
  formatMessage: IntlFormatters['formatMessage']
): Array<{ value: string; label: string }> => {
  const allowedStatus = statusAllowed[currentStatus]

  return allowedStatus.map((status) => ({
    value: status,
    label: formatMessage({ id: statusMessageId[status] }),
  }))
}

export const UpdateRequestStatus = () => {
  const [selectedStatus, setSelectedStatus] = useState<Status | ''>('')
  const [comment, setComment] = useState('')
  const [visibleForCustomer, setVisibleForCustomer] = useState(false)
  const { formatMessage } = useIntl()
  const { data, submitting, handleStatusUpdate } = useReturnDetails()

  const cleanUp = () => {
    setComment('')
    setVisibleForCustomer(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting || selectedStatus === '' || !data?.returnRequestDetails) {
      return
    }

    const newComment = !comment
      ? undefined
      : {
          value: comment,
          visibleForCustomer,
        }

    handleStatusUpdate({
      id: data.returnRequestDetails?.id,
      status: selectedStatus,
      comment: newComment,
      cleanUp,
    })
  }

  const handleStatusChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setSelectedStatus(value as Status)
  }

  const handleCommentsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target

    setComment(value)
  }

  const handleVisibleToCustomerChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const { checked } = event.target

    setVisibleForCustomer(checked)
  }

  const updateStatus =
    selectedStatus && selectedStatus !== data?.returnRequestDetails.status

  if (!data) return null

  return (
    <section>
      <h3>
        <FormattedMessage id="admin/return-app.return-request-details.update-status.title" />
      </h3>
      <form
        className="flex flex-column items-stretch w-50"
        onSubmit={handleSubmit}
      >
        <div className="mb6">
          <Dropdown
            size="small"
            placeholder={formatMessage({
              id: 'admin/return-app.return-request-details.update-status.dropdown.placeholder',
            })}
            options={createStatusOptions(
              data.returnRequestDetails.status,
              formatMessage
            )}
            value={selectedStatus}
            onChange={handleStatusChange}
          />
        </div>
        <div className="mb6">
          <Textarea
            label={
              <FormattedMessage id="admin/return-app.return-request-details.update-status.textarea.label" />
            }
            value={comment}
            onChange={handleCommentsChange}
          />
        </div>
        <div className="mb6">
          <Checkbox
            checked={visibleForCustomer}
            label={
              <FormattedMessage id="admin/return-app.return-request-details.update-status.checkbox.label" />
            }
            onChange={handleVisibleToCustomerChange}
          />
        </div>
        <div className="mb6">
          <Button
            type="submit"
            variation="primary"
            size="small"
            disabled={
              !selectedStatus ||
              (selectedStatus === data.returnRequestDetails.status && !comment)
            }
            isLoading={submitting}
          >
            {updateStatus ? (
              <FormattedMessage id="admin/return-app.return-request-details.update-status.button.update-status" />
            ) : (
              <FormattedMessage id="admin/return-app.return-request-details.update-status.button.comment" />
            )}
          </Button>
        </div>
      </form>
    </section>
  )
}
