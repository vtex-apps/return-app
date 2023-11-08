import React, { useState, useMemo } from 'react'
import { useMutation } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import { Card, Button, Alert } from 'vtex.styleguide'

import type {
  MutationCreateReturnRequestArgs,
  ReturnRequestCreated,
} from '../../../../typings/ReturnRequest'
import type { Page } from '../CreateReturnRequest'
import { useReturnRequest } from '../../hooks/useReturnRequest'
import CREATE_RETURN_REQUEST from '../graphql/createReturnRequest.gql'
import { ReturnInformationTable } from './ReturnInformationTable'
import { ConfirmContactDetails } from './ConfirmContactDetails'
import { ConfirmPickupAddressDetails } from './ConfirmPickupAddressDetails'
import { ConfirmPaymentMethods } from './ConfirmPaymentMethods'
import { ConfirmComment } from './ConfirmComment'
import { validateNewReturnRequestFields } from '../../utils/validateNewReturnRequestFields'
import { useStoreSettings } from '../../hooks/useStoreSettings'

interface Props {
  onPageChange: (page: Page) => void
  items: ItemToReturn[]
  isAdmin: boolean
}

type SubmissionStatus = 'success' | 'error' | 'idle'

const CSS_HANDLES = [
  'submitDetailsContainer',
  'contactAddressWrapper',
  'paymentCommentWrapper',
  'confirmationActionsContainer',
  'backButtonWrapper',
  'submitButtonWrapper',
] as const

export const ConfirmAndSubmit = ({ onPageChange, items, isAdmin }: Props) => {
  const { returnRequest, termsAndConditions } = useReturnRequest()

  const [createReturnRequest, { loading: creatingReturnRequest }] = useMutation<
    { createReturnRequest: ReturnRequestCreated },
    MutationCreateReturnRequestArgs
  >(CREATE_RETURN_REQUEST)

  const {
    navigate,
    culture: { locale },
    hints: { phone },
  } = useRuntime()

  const { data: storeSettings } = useStoreSettings()
  const { options } = storeSettings ?? {}
  const { enableSelectItemCondition } = options ?? {}

  const [confirmationStatus, setConfirmationStatus] =
    useState<SubmissionStatus>('idle')

  const handles = useCssHandles(CSS_HANDLES)

  const returnRequestValidated = useMemo(() => {
    const { validatedFields } = validateNewReturnRequestFields(returnRequest, {
      termsAndConditionsAccepted: termsAndConditions,
      locale,
      considerItemCondition: Boolean(enableSelectItemCondition),
    })

    return validatedFields
  }, [termsAndConditions, returnRequest, locale, enableSelectItemCondition])

  const handleCreateReturnRequest = async () => {
    if (creatingReturnRequest || !returnRequestValidated) return

    try {
      const { errors } = await createReturnRequest({
        variables: {
          returnRequest: { ...returnRequestValidated },
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
      to: isAdmin ? '/admin/app/returns/orders/' : `#/my-returns`,
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
              <div
                className={`${handles.confirmationActionsContainer} flex flex-wrap`}
              >
                <section
                  className={`${
                    handles.contactAddressWrapper
                  } w-100 flex flex-wrap justify-between ${
                    phone ? 'flex-column' : ''
                  }`}
                >
                  <ConfirmContactDetails
                    contactDetails={returnRequestValidated.customerProfileData}
                  />
                  <ConfirmPickupAddressDetails
                    pickupReturnData={returnRequestValidated.pickupReturnData}
                  />
                </section>
                <section
                  className={`${
                    handles.paymentCommentWrapper
                  } w-100 flex mt5 justify-between ${
                    phone ? 'flex-column' : ''
                  }`}
                >
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
          <section
            className={`${handles.confirmationActionsContainer} flex justify-center`}
          >
            {confirmationStatus !== 'success' ? null : (
              <Alert
                type={confirmationStatus}
                action={{
                  label: (
                    <FormattedMessage id="return-app.confirm-and-submit.alert.label" />
                  ),
                  onClick: () => handleAlertRedirect(),
                }}
              >
                <FormattedMessage id="return-app.confirm-and-submit.alert.success" />
              </Alert>
            )}
            {confirmationStatus !== 'error' ? null : (
              <Alert
                type={confirmationStatus}
                action={{
                  label: (
                    <FormattedMessage id="return-app.confirm-and-submit.alert.error.label" />
                  ),
                  onClick: () => handleCreateReturnRequest(),
                }}
              >
                <FormattedMessage id="return-app.confirm-and-submit.alert.error" />
              </Alert>
            )}
            {confirmationStatus !== 'idle' ? null : (
              <div
                className={`flex ${
                  phone ? 'w-100 flex-column' : 'justify-center'
                }`}
              >
                <div
                  className={`${handles.backButtonWrapper} ${
                    phone ? 'mb5' : 'mr3'
                  }`}
                >
                  <Button
                    block={phone}
                    size={phone ? 'normal' : 'small'}
                    variation="secondary"
                    onClick={() => handlePageChange()}
                  >
                    <FormattedMessage id="return-app.confirm-and-submit.button.back" />
                  </Button>
                </div>
                <div
                  className={`${handles.submitButtonWrapper} ${
                    phone ? '' : 'mr3'
                  }`}
                >
                  <Button
                    block={phone}
                    size={phone ? 'normal' : 'small'}
                    onClick={handleCreateReturnRequest}
                    isLoading={creatingReturnRequest}
                  >
                    <FormattedMessage id="return-app.confirm-and-submit.button.submit" />
                  </Button>
                </div>
              </div>
            )}
          </section>
        </>
      )}
    </>
  )
}
