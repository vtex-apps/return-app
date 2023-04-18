import type { FormEvent, ChangeEvent } from 'react'
import React, { useState } from 'react'
import type { IntlFormatters } from 'react-intl'
import { FormattedMessage, useIntl } from 'react-intl'
import {
  Dropdown,
  Textarea,
  Checkbox,
  Button,
  Tooltip,
  IconInfo,
} from 'vtex.styleguide'
import type { Status } from '../../../../typings/ReturnRequest'

import { useReturnDetails } from '../../../common/hooks/useReturnDetails'
import {
  statusAllowed,
  statusMessageIdAdmin,
} from '../../../utils/requestStatus'
import { useUpdateRequestStatus } from '../../hooks/useUpdateRequestStatus'

const createStatusOptions = (
  currentStatus: Status,
  formatMessage: IntlFormatters['formatMessage']
): Array<{ value: string; label: string }> => {
  const allowedStatus = statusAllowed[currentStatus]

  return allowedStatus.map((status) => ({
    value: status,
    label: formatMessage(statusMessageIdAdmin[status]),
  }))
}

interface Props {
  onViewVerifyItems: () => void
}

export const UpdateRequestStatus = ({ onViewVerifyItems }: Props) => {
  const [selectedStatus, setSelectedStatus] = useState<Status | ''>('')
  const [comment, setComment] = useState('')
  const [visibleForCustomer, setVisibleForCustomer] = useState(false)
  const { formatMessage } = useIntl()
  const { data } = useReturnDetails()
  const { submitting, handleStatusUpdate } = useUpdateRequestStatus()

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
    <section className="mv4">
      <div className="flex items-center">
        <h3>
          <FormattedMessage id="admin/return-app.return-request-details.update-status.title" />
        </h3>
        <Tooltip
          label={
            <FormattedMessage id="admin/return-app.return-request-details.update-status.tooltip" />
          }
        >
          <span className="yellow pointer ml3 flex">
            <IconInfo />
          </span>
        </Tooltip>
      </div>
      <form
        className="flex flex-column items-stretch w-50"
        onSubmit={handleSubmit}
      >
        <div className="mb6">
          <FormattedMessage id="admin/return-app.return-request-details.update-status.dropdown.placeholder">
            {(placeholder) => (
              <Dropdown
                size="small"
                placeholder={placeholder}
                options={createStatusOptions(
                  data.returnRequestDetails.status,
                  formatMessage
                )}
                value={selectedStatus}
                onChange={handleStatusChange}
              />
            )}
          </FormattedMessage>
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
          {data.returnRequestDetails.status === 'pendingVerification' ? (
            <span className="ml4">
              <Button type="button" onClick={onViewVerifyItems} size="small">
                <FormattedMessage id="admin/return-app.return-request-details.verify-items.button" />
              </Button>
            </span>
          ) : null}
        </div>
      </form>
    </section>
  )
}
