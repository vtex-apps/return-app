/* eslint-disable no-console */
import React from 'react'
import { utils, Button, EXPERIMENTAL_Modal as Modal } from 'vtex.styleguide'
/* import { useDisclosure } from 'vtex.styleguide/react/utilities/useDisclosure' */
import { useRuntime } from 'vtex.render-runtime'
import { defineMessages } from 'react-intl'
import type { Status } from 'vtex.return-app'

import { useReturnDetails } from '../../hooks/useReturnDetails'

type AdminAllowedStatus = Extract<
  Status,
  'new' | 'processing' | 'pickedUpFromClient'
>

export const messages = defineMessages({
  adminAllow: {
    id: "Attention: This request's status will be set to CANCELLED. Doing so the user will be notified via email; allowing them to create a new return request with the items of the cancelled request. If you intend otherwhise, you are maybe looking to set the request as DENIED",
  },
  adminRefuse: {
    id: "Sorry, due to this request's current status, it's not possible to cancel this request",
  },
  storeAllow: {
    id: 'Cancelling this request will allow the current items to be used in the creation of a new return request. This action is irreversible',
  },
  storeRefuse: {
    id: "Sorry, due to this request's current status, you'll need to contact the support team to request a cancellation",
  },
})

const allowedStatuses = ['new', 'processing', 'pickedUpFromClient'] as const

const RequestCancellation = () => {
  const { isOpen, onOpen, onClose } = utils.useDisclosure()
  const { data } = useReturnDetails()
  const {
    route: { domain },
  } = useRuntime()

  if (!data) return null

  const isAdmin = domain === 'admin'
  const { status } = data.returnRequestDetails

  // Both the user and the admin have different rules and messages
  let messageKey: string
  let enableSubmit = false

  if (isAdmin) {
    enableSubmit = allowedStatuses.some(
      (stat: AdminAllowedStatus) => stat === status
    )
    messageKey = enableSubmit ? 'adminAllow' : 'adminRefuse'
  } else {
    enableSubmit = status === 'new'
    messageKey = enableSubmit ? 'storeAllow' : 'storeRefuse'
  }

  return (
    <>
      <Button variation="danger" size="small" onClick={onOpen}>
        Cancel request
      </Button>

      <Modal
        size="small"
        isOpen={isOpen}
        onClose={onClose}
        bottomBar={
          <div className="nowrap">
            <span className="mr4">
              <Button size="small" variation="tertiary" onClick={onClose}>
                Close
              </Button>
            </span>
            <span>
              <Button
                size="small"
                disabled={!enableSubmit}
                variation="danger"
                onClick={onClose}
              >
                Proceed to cancel
              </Button>
            </span>
          </div>
        }
      >
        <div>
          <p>{messages[messageKey].id}</p>
        </div>
      </Modal>
    </>
  )
}

export default RequestCancellation
