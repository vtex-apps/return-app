import type { FormEvent, ChangeEvent } from 'react'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Textarea, Checkbox, Button, Tooltip, IconInfo } from 'vtex.styleguide'

import type { Status } from '../../../../typings/ReturnRequest'
import { useReturnDetails } from '../../../common/hooks/useReturnDetails'
import { useUpdateRequestStatus } from '../../hooks/useUpdateRequestStatus'

interface Props {
  onViewVerifyItems: () => void
}

export const UpdateRequestStatus = (_: Props) => {
  const [selectedStatus] = useState<Status | ''>('')
  const [comment, setComment] = useState('')
  const [visibleForCustomer, setVisibleForCustomer] = useState(false)
  const { data } = useReturnDetails()
  const { submitting, handleStatusUpdate } = useUpdateRequestStatus()

  const cleanUp = () => {
    setComment('')
    setVisibleForCustomer(false)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting || !data?.returnRequestDetails) {
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
      status: data.returnRequestDetails?.status,
      comment: newComment,
      cleanUp,
    })
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
            disabled={!comment}
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
