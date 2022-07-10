import type { ReactElement } from 'react'
import React from 'react'
import { ModalDialog } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import { useSettings } from '../hooks/useSettings'
import type { ModalWarningState } from '../RMASettings'

interface WarningModalContentProps {
  maxDays: number
  customMaxDays: number
}

interface WarningModalProps {
  setWarning: React.Dispatch<React.SetStateAction<ModalWarningState>>
  customMaxDays: number
}

const StrongChunk = (chunks: ReactElement) => <b>{chunks}</b>

const WarningModalContent = (props: WarningModalContentProps) => {
  const { maxDays, customMaxDays } = props

  return (
    <div>
      <p className="f3 f3-ns fw3 gray">
        <FormattedMessage id="admin/return-app.settings.modal-warning.title" />
      </p>
      <p>
        <FormattedMessage
          id="admin/return-app.settings.modal-warning.first-paragraph"
          values={{
            b: StrongChunk,
            maxDays,
          }}
        />
      </p>
      <p>
        <FormattedMessage id="admin/return-app.settings.modal-warning.second-paragraph" />
      </p>
      <p>
        <FormattedMessage
          id="admin/return-app.settings.modal-warning.third-paragraph"
          values={{
            b: StrongChunk,
            maxDays,
            customMaxDays,
          }}
        />
      </p>
    </div>
  )
}

export const WarningModal = (props: WarningModalProps) => {
  const { customMaxDays, setWarning } = props

  const {
    appSettings,
    actions: { dispatch },
  } = useSettings()

  const handleWarningModal = (overrideAndSave: boolean) => {
    overrideAndSave &&
      dispatch({
        type: 'updateMaxDays',
        payload: customMaxDays,
      })

    setWarning({
      openModal: false,
      customMaxDays: 0,
      attemptNewSave: overrideAndSave,
    })
  }

  return (
    <ModalDialog
      centered
      confirmation={{
        onClick: () => {
          handleWarningModal(true)
        },
        label: (
          <FormattedMessage id="admin/return-app.settings.modal-warning.confirm" />
        ),
        isDangerous: true,
      }}
      cancelation={{
        onClick: () => {
          handleWarningModal(false)
        },
        label: (
          <FormattedMessage id="admin/return-app.settings.modal-warning.cancel" />
        ),
      }}
      isOpen
      onClose={() => {
        handleWarningModal(false)
      }}
    >
      <WarningModalContent
        maxDays={appSettings.maxDays}
        customMaxDays={customMaxDays}
      />
    </ModalDialog>
  )
}

export default WarningModal
