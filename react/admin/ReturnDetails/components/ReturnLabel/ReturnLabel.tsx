import React, { useEffect, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { ButtonPlain, ModalDialog, Tooltip, IconInfo } from 'vtex.styleguide'

import { useReturnDetails } from '../../../../common/hooks/useReturnDetails'
import { useAlert } from '../../../hooks/userAlert'
import GET_APP from './graphql/getInstalledApp.gql'
import SEND_LABEL from './graphql/sendLabel.gql'
import CREATE_LABEL from './graphql/createLabel.gql'

const ReturnLabel = () => {
  const [displayButton, setDisplayButton] = useState(false)
  const [disableLabelUrl, setDisbleLabelUrl] = useState(true)
  const [labelUrl, setLabelUrl] = useState('')
  const [disableCreateLabel, setDisableCreateLabel] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [, setReturnAddress] = useState({
    street1: '',
    street2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    name: '',
    phone: '',
  })

  const { data } = useReturnDetails()
  const { openAlert } = useAlert()

  const { data: installedApp } = useQuery(GET_APP, {
    variables: {
      slug: 'vtex.easypost',
    },
  })

  useEffect(() => {
    if (!installedApp?.app) return

    const { app } = installedApp

    const appSettings = JSON.parse(app.settings)
    const { street1, street2, city, state, zip, country, name, phone } =
      appSettings

    setReturnAddress({
      street1,
      street2,
      city,
      state,
      zip,
      country,
      name,
      phone,
    })

    setDisplayButton(true)
  }, [installedApp])

  useEffect(() => {
    if (!data) return

    const {
      status,
      pickupReturnData: { returnLabel },
    } = data.returnRequestDetails

    if (status === 'processing') {
      setDisableCreateLabel(false)

      if (returnLabel) {
        setLabelUrl(returnLabel)
        setDisbleLabelUrl(false)
        setDisableCreateLabel(true)
      }
    }
  }, [data])

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleCancelation = () => {
    setIsModalOpen(false)
  }

  const [, { loading: creatingLabel }] = useMutation(CREATE_LABEL)
  const [sendLabel, { loading: sendingEmail }] = useMutation(SEND_LABEL)

  const handleConfirmation = async () => {
    // temp labelUrl [DELETE when we have the client Key from easypost]
    const createdLabelUrl =
      'https://assets.easypost.com/assets/images/usps-international-label.c7c603e0b25b12e4489a8c75db0d34b8.png'

    try {
      // Send mutation to EasyPost
      // const createdLabelUrl = await createLabel({
      //   variables: {
      //     ...returnAddress,
      //   },
      // })

      await sendLabel({
        variables: {
          requestId: data?.returnRequestDetails.id,
          labelUrl: createdLabelUrl,
        },
      })

      openAlert(
        'success',
        <FormattedMessage id="admin/return-app.return-request-details.return-label.alert.success" />
      )
    } catch (error) {
      openAlert(
        'error',
        <FormattedMessage id="admin/return-app.return-request-details.return-label.alert.error" />
      )
    }

    setIsModalOpen(false)
  }

  const handleOpenLabelUrl = () => {
    window.open(labelUrl, '_blank')
  }

  if (!displayButton) return null

  return (
    <div className="mb4">
      {displayButton && (
        <div className="flex">
          <div className="mr4">
            <ButtonPlain
              className="mr4"
              disabled={disableCreateLabel}
              onClick={handleToggleModal}
            >
              <FormattedMessage id="admin/return-app.return-request-details.return-label.create-return-label" />
            </ButtonPlain>
          </div>
          <ButtonPlain disabled={disableLabelUrl} onClick={handleOpenLabelUrl}>
            <FormattedMessage id="admin/return-app.return-request-details.return-label.see-return-label" />
          </ButtonPlain>
          <div className="flex items-center ml3">
            <Tooltip
              label={
                <FormattedMessage id="admin/return-app.return-request-details.return-label-info.tooltip" />
              }
              position="left"
            >
              <div className="flex items-center">
                <span className="yellow">
                  <IconInfo className=" ml5 o-50" />
                </span>
              </div>
            </Tooltip>
          </div>
        </div>
      )}

      <ModalDialog
        isOpen={isModalOpen}
        onClose={handleCancelation}
        loading={sendingEmail || creatingLabel}
        confirmation={{
          label: (
            <FormattedMessage id="admin/return-app.return-request-details.return-label.create-return-label" />
          ),
          onClick: handleConfirmation,
        }}
        cancelation={{
          label: (
            <FormattedMessage id="admin/return-app.settings.modal-warning.cancel" />
          ),
          onClick: handleCancelation,
        }}
      >
        <div>
          <p className="f3 f3-ns fw3 gray">
            <FormattedMessage id="admin/return-app.return-request-details.return-label.modal-title" />
          </p>
          <p>
            <FormattedMessage id="admin/return-app.return-request-details.return-label.modal-message" />
          </p>
        </div>
      </ModalDialog>
    </div>
  )
}

export { ReturnLabel }
