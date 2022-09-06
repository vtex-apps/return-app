import React, { Fragment, useState } from 'react'
import { useMutation, useQuery } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import {
  ButtonPlain,
  Collapsible,
  Link,
  ModalDialog,
  Tooltip,
  IconInfo,
} from 'vtex.styleguide'

import { useReturnDetails } from '../../../../common/hooks/useReturnDetails'
import { useAlert } from '../../../hooks/userAlert'
import GET_APP from './graphql/getInstalledApp.gql'
import SEND_LABEL from './graphql/sendLabel.gql'
import CREATE_LABEL from './graphql/createLabel.gql'

const ReturnLabel = () => {
  const { data } = useReturnDetails()
  const { openAlert } = useAlert()

  const [labelUrl, setLabelUrl] = useState(
    data?.returnRequestDetails.pickupReturnData.labelUrl ?? ''
  )

  const [returnAddress, setReturnAddress] = useState<ReturnLabelAddress | null>(
    null
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false)

  const { loading, error } = useQuery<{
    app: {
      settings: string
    }
  }>(GET_APP, {
    variables: {
      slug: 'vtex.easypost',
    },
    onCompleted(installedApp) {
      const {
        app: { settings },
      } = installedApp

      const { street1, street2, city, state, zip, country, name, phone } =
        JSON.parse(settings) as ReturnLabelAddress

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
    },
  })

  const handleToggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const handleToggleCollapsible = () => {
    setIsCollapsibleOpen(!isCollapsibleOpen)
  }

  const handleCancelation = () => {
    setIsModalOpen(false)
  }

  const [, { loading: loadingLabel }] = useMutation(CREATE_LABEL)
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

      setLabelUrl(createdLabelUrl)

      openAlert(
        'success',
        <FormattedMessage id="admin/return-app.return-request-details.return-label.alert.success" />
      )
    } catch (err) {
      openAlert(
        'error',
        <FormattedMessage id="admin/return-app.return-request-details.return-label.alert.error" />
      )
    }

    setIsModalOpen(false)
  }

  if (loading || error) return null

  return (
    <div className="mv4">
      <div className="flex">
        {returnAddress &&
          (labelUrl === '' ? (
            <Fragment>
              <ButtonPlain
                className="mr4"
                disabled={data?.returnRequestDetails.status !== 'processing'}
                onClick={handleToggleModal}
              >
                <FormattedMessage id="admin/return-app.return-request-details.return-label.create-return-label" />
              </ButtonPlain>
              <div className="flex items-center ml3">
                <Tooltip
                  label={
                    <FormattedMessage id="admin/return-app.return-request-details.return-label-info.tooltip" />
                  }
                  position="right"
                >
                  <div className="flex items-center">
                    <span className="yellow">
                      <IconInfo className=" ml5 o-50" />
                    </span>
                  </div>
                </Tooltip>
              </div>
            </Fragment>
          ) : (
            <Collapsible
              header={
                <div className="fw5">
                  <FormattedMessage id="admin/return-app.return-request-details.return-label.see-return-label" />
                </div>
              }
              isOpen={isCollapsibleOpen}
              onClick={handleToggleCollapsible}
            >
              <div className="mv3 t-small">
                <Link href={labelUrl} target="_blank">
                  {labelUrl}
                </Link>
              </div>
            </Collapsible>
          ))}
      </div>

      <ModalDialog
        isOpen={isModalOpen}
        onClose={handleCancelation}
        loading={sendingEmail || loadingLabel}
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
