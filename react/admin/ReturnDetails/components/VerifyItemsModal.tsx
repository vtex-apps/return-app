import React from 'react'
import { ModalDialog } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

interface Props {
  isOpen: boolean
  onViewVerifyItems: () => void
}

export const VerifyItemsModal = ({ isOpen, onViewVerifyItems }: Props) => {
  return (
    <ModalDialog
      centered
      confirmation={{
        onClick: () => {},
        label: (
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.modal.confirm" />
        ),
      }}
      cancelation={{
        onClick: onViewVerifyItems,
        label: (
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.modal.cancel" />
        ),
      }}
      onClose={onViewVerifyItems}
      isOpen={isOpen}
    >
      <div>Hello world</div>
    </ModalDialog>
  )
}
