/* eslint-disable no-console */
import React from 'react'
import type { FormEvent, ReactElement } from 'react'
import { utils, Button, EXPERIMENTAL_Modal as Modal } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { defineMessages, FormattedMessage, useIntl } from 'react-intl'

import { useReturnDetails } from '../../hooks/useReturnDetails'
import { useUpdateRequestStatus } from '../../../admin/hooks/useUpdateRequestStatus'

type CancellationMessage =
  | 'adminAllow'
  | 'adminRefuse'
  | 'storeAllow'
  | 'storeRefuse'

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

  const isDisabled = ['amountRefunded', 'denied', 'canceled'].includes(status)

  if (isDisabled) return null

  const isAdmin = domain === 'admin'

  // Both the user and the admin have different rules and messages
  let messageKey: CancellationMessage

  if (isAdmin) {
    messageKey =
      status === 'new' || status === 'processing' ? 'adminAllow' : 'adminRefuse'
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
      status: 'canceled',
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
            <span>
              <Button
                size="small"
                disabled={['adminRefuse', 'storeRefuse'].includes(messageKey)}
                variation="danger"
                onClick={handleSubmit}
                isLoading={submitting}
              >
                <FormattedMessage id="return-app.return-request-details.cancellation.modal.accept" />
              </Button>
            </span>
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
