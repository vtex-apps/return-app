import React, { useState, useMemo } from 'react'
import { useMutation } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import type {
  MutationCreateReturnRequestArgs,
  ReturnRequestCreated,
} from 'vtex.return-app'
import { Card, Button, Alert } from 'vtex.styleguide'

import type { Page } from '../CreateReturnRequest'
import { useReturnRequest } from '../../hooks/useReturnRequest'
import CREATE_RETURN_REQUEST from '../graphql/createReturnRequest.gql'
import { ReturnInformationTable } from './ReturnInformationTable'
import { ConfirmContactDetails } from './ConfirmContactDetails'
import { ConfirmPickupAddressDetails } from './ConfirmPickupAddressDetails'
import { ConfirmPaymentMethods } from './ConfirmPaymentMethods'
import { ConfirmComment } from './ConfirmComment'
import { validateNewReturnRequestFields } from '../../utils/validateNewReturnRequestFields'

interface Props {
  onPageChange: (page: Page) => void
  items: ItemToReturn[]
}

type SubmissionStatus = 'success' | 'error' | 'idle'

export const ConfirmAndSubmit = ({ onPageChange, items }: Props) => {
  const { returnRequest, termsAndConditions } = useReturnRequest()

  const [createReturnRequest, { loading: creatingReturnRequest }] = useMutation<
    { createReturnRequest: ReturnRequestCreated },
    MutationCreateReturnRequestArgs
  >(CREATE_RETURN_REQUEST)

  const {
    navigate,
    culture: { locale },
  } = useRuntime()

  const [confirmationStatus, setConfirmationStatus] =
    useState<SubmissionStatus>('idle')

  const returnRequestValidated = useMemo(() => {
    const { validatedFields } = validateNewReturnRequestFields(
      termsAndConditions,
      returnRequest
    )

    return validatedFields
  }, [termsAndConditions, returnRequest])

  const handleCreateReturnRequest = async () => {
    if (creatingReturnRequest || !returnRequestValidated) return

    try {
      const { errors } = await createReturnRequest({
        variables: {
          returnRequest: { ...returnRequestValidated, locale },
        },
      })

      if (errors) {
        // TODO: handle validation errors coming from the server
        throw new Error('Error creating return request')
      }

      setConfirmationStatus('success')
    } catch (error) {
      console.error({ error })
      setConfirmationStatus('error')
    }
  }

  const handleAlertRedirect = () => {
    setConfirmationStatus('idle')
    navigate({
      to: `#/my-returns`,
      replace: true,
    })
  }

  const handlePageChange = () => {
    setConfirmationStatus('idle')
    onPageChange('form-details')
  }

  return (
    <>
      {!returnRequestValidated ? null : (
        <>
          <ReturnInformationTable
            items={items}
            selectedItems={returnRequestValidated.items}
          />
          <div className="mv8">
            <Card>
              <div className="flex flex-wrap">
                <section className="w-100 flex flex-wrap justify-between">
                  <ConfirmContactDetails
                    contactDetails={returnRequestValidated.customerProfileData}
                  />
                  <ConfirmPickupAddressDetails
                    pickupReturnData={returnRequestValidated.pickupReturnData}
                  />
                </section>
                <section className="w-100 flex mt5 justify-between">
                  <ConfirmPaymentMethods
                    refundPaymentData={returnRequestValidated.refundPaymentData}
                  />
                  <ConfirmComment
                    userComment={returnRequestValidated.userComment}
                  />
                </section>
              </div>
            </Card>
          </div>
          <section className="flex justify-center">
            {confirmationStatus !== 'success' ? null : (
              <Alert
                type={confirmationStatus}
                action={{
                  label: (
                    <FormattedMessage id="store/return-app.confirm-and-submit.alert.label" />
                  ),
                  onClick: () => handleAlertRedirect(),
                }}
              >
                <FormattedMessage id="store/return-app.confirm-and-submit.alert.success" />
              </Alert>
            )}
            {confirmationStatus !== 'error' ? null : (
              <Alert
                type={confirmationStatus}
                action={{
                  label: (
                    <FormattedMessage id="store/return-app.confirm-and-submit.alert.error.label" />
                  ),
                  onClick: () => handleCreateReturnRequest(),
                }}
              >
                <FormattedMessage id="store/return-app.confirm-and-submit.alert.error" />
              </Alert>
            )}
            {confirmationStatus !== 'idle' ? null : (
              <>
                <div className="mr3">
                  <Button
                    size="small"
                    variation="secondary"
                    onClick={() => handlePageChange()}
                  >
                    <FormattedMessage id="store/return-app.confirm-and-submit.button.back" />
                  </Button>
                </div>
                <div className="ml3">
                  <Button
                    size="small"
                    onClick={handleCreateReturnRequest}
                    isLoading={creatingReturnRequest}
                  >
                    <FormattedMessage id="store/return-app.confirm-and-submit.button.submit" />
                  </Button>
                </div>
              </>
            )}
          </section>
        </>
      )}
    </>
  )
}
