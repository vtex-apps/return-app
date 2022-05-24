import React, { useState, useMemo } from 'react'
import { useMutation } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import type {
  MutationCreateReturnRequestArgs,
  ReturnRequestCreated,
} from 'vtex.return-app'
import { PageBlock, PageHeader, Card, Button, Alert } from 'vtex.styleguide'

import type { Page } from '../ReturnDetailsContainer'
import { useReturnRequest } from '../../hooks/useReturnRequest'
import CREATE_RETURN_REQUEST from '../graphql/createReturnRequest.gql'
import { ReturnInformationTable } from './ReturnInformationTable'
import { ConfirmContactDetails } from './ConfirmContactDetails'
import { ConfirmPickupAddressDetails } from './ConfirmPickupAddressDetails'
import { ConfirmPaymentMethods } from './ConfirmPaymentMethods'
import { validateNewReturnRequestFields } from '../../utils/validateNewReturnRequestFields'

interface Props {
  onPageChange: (page: Page) => void
  items: ItemToReturn[]
}

type SubmissionStatus = 'success' | 'error' | ''

export const ConfirmAndSubmit = ({ onPageChange, items }: Props) => {
  const { returnRequest, termsAndConditions } = useReturnRequest()
  const [createReturnRequest, { loading: creatingReturnRequest }] = useMutation<
    { createReturnRequest: ReturnRequestCreated },
    MutationCreateReturnRequestArgs
  >(CREATE_RETURN_REQUEST)

  const { navigate } = useRuntime()

  const [confirmationStatus, setConfirmationStatus] =
    useState<SubmissionStatus>('')

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
          returnRequest: returnRequestValidated,
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
    setConfirmationStatus('')
    navigate({
      to: `#/my-returns`,
    })
  }

  const handlePageChange = () => {
    setConfirmationStatus('')
    onPageChange('form-details')
  }

  return (
    <PageBlock className="ph0 mh0 pa0 pa0-ns">
      <PageHeader
        className="ph0 mh0 nl5"
        title={
          <FormattedMessage id="store/return-app.confirm-and-submit.page-header.title" />
        }
      />
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
                <section className="w-100 flex mt5">
                  <ConfirmPaymentMethods
                    refundPaymentData={returnRequestValidated.refundPaymentData}
                  />
                </section>
              </div>
            </Card>
          </div>
          <section className="flex justify-center">
            {confirmationStatus ? (
              confirmationStatus === 'success' ? (
                <Alert
                  type={confirmationStatus}
                  action={{
                    label: (
                      <FormattedMessage id="store/return-app.confirm-and-submit.alert.label" />
                    ),
                    onClick: () => handleAlertRedirect,
                  }}
                >
                  <FormattedMessage id="store/return-app.confirm-and-submit.alert.success" />
                </Alert>
              ) : (
                <Alert type={confirmationStatus}>
                  <FormattedMessage id="store/return-app.confirm-and-submit.alert.error" />
                </Alert>
              )
            ) : (
              <>
                <div className="mr3">
                  <Button
                    size="small"
                    variation="secondary"
                    onClick={() => handlePageChange}
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
    </PageBlock>
  )
}
