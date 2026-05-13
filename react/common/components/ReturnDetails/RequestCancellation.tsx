/* eslint-disable no-console */
import React from 'react'
import type { FormEvent, ReactElement } from 'react'
import { utils, Button, EXPERIMENTAL_Modal as Modal } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'
import type { Status } from 'vtex.return-app'

import { useReturnDetails } from '../../hooks/useReturnDetails'
import { useUpdateRequestStatus } from '../../../admin/hooks/useUpdateRequestStatus'

type CancellationMessage =
  | 'adminAllow'
  | 'adminRefuse'
  | 'storeAllow'
  | 'storeRefuse'

// Status transition rules based on backend validation
// Source: node/utils/validateStatusUpdate.ts
const statusAllowed: Record<Status, Status[]> = {
  new: ['new', 'processing', 'cancelled'],
  processing: [
    'processing',
    'pickedUpFromClient',
    'pendingVerification',
    'packageVerified',
    'cancelled',
  ],
  pickedUpFromClient: [
    'pickedUpFromClient',
    'pendingVerification',
    'packageVerified',
    'denied',
  ],
  pendingVerification: ['pendingVerification', 'packageVerified', 'denied'],
  packageVerified: ['packageVerified', 'amountRefunded', 'denied'],
  amountRefunded: ['amountRefunded', 'closed'],
  denied: ['denied'],
  cancelled: ['cancelled'],
  closed: ['closed'],
}

const canTransitionTo = (
  currentStatus: Status,
  targetStatus: Status
): boolean => {
  return statusAllowed[currentStatus]?.includes(targetStatus) ?? false
}

export const messages = defineMessages({
  adminAllow: {
    id: 'return-app.return-request-details.cancellation.modal.adminAllow',
  },
  adminRefuse: {
    id: 'return-app.return-request-details.cancellation.modal.adminRefuse',
  },
  storeAllow: {
    id: 'return-app.return-request-details.cancellation.modal.storeAllow',
  },
  storeRefuse: {
    id: 'return-app.return-request-details.cancellation.modal.storeRefuse',
  },
})

const ParagraphChunk = (chunks: ReactElement) => <p>{chunks}</p>

const RequestCancellation = () => {
  const { isOpen, onOpen, onClose } = utils.useDisclosure()
  const { data } = useReturnDetails()
  const {
    route: { domain },
    hints: { phone },
  } = useRuntime()

  const { formatMessage } = useIntl()

  const { submitting, handleStatusUpdate } = useUpdateRequestStatus()

  if (!data) return null

  const { status, id } = data.returnRequestDetails

  const isDisabled = ['denied', 'cancelled'].includes(status)

  if (isDisabled) {
    return (
      <Button variation="danger" size="small" disabled>
        <FormattedMessage id="return-app.return-request-details.cancellation.cta" />
      </Button>
    )
  }

  const isAdmin = domain === 'admin'

  // Check if status transitions are allowed based on backend rules
  const canCancel = canTransitionTo(status, 'cancelled')
  const canDeny = canTransitionTo(status, 'denied')

  // Both the user and the admin have different rules and messages
  let messageKey: CancellationMessage

  if (isAdmin) {
    messageKey = canCancel ? 'adminAllow' : 'adminRefuse'
  } else {
    messageKey = status === 'new' ? 'storeAllow' : 'storeRefuse'
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (submitting) {
      return
    }

    handleStatusUpdate({
      id,
      status: 'cancelled',
      cleanUp: () => {
        onClose()
      },
    })
  }

  const handleDeny = async () => {
    if (submitting) {
      return
    }

    handleStatusUpdate({
      id,
      status: 'denied',
      cleanUp: () => {
        onClose()
      },
    })
  }

  return (
    <>
      <div className={phone ? 'mt4' : ''}>
        <Button
          variation="danger"
          size="small"
          onClick={onOpen}
          disabled={isDisabled}
        >
          <FormattedMessage id="return-app.return-request-details.cancellation.cta" />
        </Button>
      </div>

      <Modal
        size="small"
        isOpen={isOpen}
        onClose={onClose}
        bottomBar={
          <div className="nowrap">
            <span className="mr4">
              <Button
                size="small"
                variation="tertiary"
                onClick={onClose}
                disabled={submitting}
              >
                <FormattedMessage id="return-app.return-request-details.cancellation.modal.close" />
              </Button>
            </span>
            {canDeny && (
              <span className="mr4">
                <Button
                  size="small"
                  variation="secondary"
                  onClick={handleDeny}
                  disabled={submitting}
                  isLoading={submitting}
                >
                  <FormattedMessage id="return-app.return-request-details.cancellation.modal.deny" />
                </Button>
              </span>
            )}
            {canCancel && (
              <span>
                <Button
                  size="small"
                  disabled={submitting}
                  variation="danger"
                  onClick={handleSubmit}
                  isLoading={submitting}
                >
                  <FormattedMessage id="return-app.return-request-details.cancellation.modal.accept" />
                </Button>
              </span>
            )}
          </div>
        }
      >
        <div>
          {formatMessage(messages[messageKey], {
            p: ParagraphChunk,
          })}
        </div>
      </Modal>
    </>
  )
}

export default RequestCancellation
