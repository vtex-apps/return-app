import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import type {
  MutationCreateReturnRequestArgs,
  ReturnRequestCreated,
} from 'vtex.return-app'
import { PageBlock, PageHeader, Card, Button } from 'vtex.styleguide'

import type { Page } from '../ReturnDetailsContainer'
import { useReturnRequest } from '../../hooks/useReturnRequest'
import CREATE_RETURN_REQUEST from '../graphql/createReturnRequest.gql'
import { ReturnInformationTable } from './ReturnInformationTable'
import { ConfirmContactDetails } from './ConfirmContactDetails'
import { ConfirmPickupAddressDetails } from './ConfirmPickupAddressDetails'
import ConfirmPaymentMethods from './ConfirmPaymentMethods'

interface Props {
  onPageChange: (page: Page) => void
  items: ItemToReturn[]
}

export const ConfirmAndSubmit = ({ onPageChange, items }: Props) => {
  const { returnRequest, validatedRmaFields } = useReturnRequest()
  const [createReturnRequest, { loading: creatingReturnRequest }] = useMutation<
    { createReturnRequest: ReturnRequestCreated },
    MutationCreateReturnRequestArgs
  >(CREATE_RETURN_REQUEST)

  // temp state just to show request id on UI
  const [requestId, setRequestId] = useState('')

  const handleCreateReturnRequest = async () => {
    if (!validatedRmaFields || creatingReturnRequest) return

    try {
      const { errors, data } = await createReturnRequest({
        variables: {
          returnRequest: validatedRmaFields,
        },
      })

      if (errors) {
        // TODO: handle validation errors coming from the server
        throw new Error('Error creating return request')
      }

      if (data?.createReturnRequest?.returnRequestId) {
        setRequestId(data.createReturnRequest.returnRequestId)
      }
    } catch (error) {
      console.error({ error })
    }
  }

  return (
    <PageBlock className="ph0 mh0 pa0 pa0-ns">
      {/* TODO INTL */}
      <PageHeader
        className="ph0 mh0 nl5"
        title={
          <FormattedMessage id="store/return-app.confirm-and-submit.page-header.title" />
        }
      />
      {requestId ? (
        <div>{requestId}</div>
      ) : (
        <>
          <ReturnInformationTable
            items={items}
            selectedItems={returnRequest.items}
          />
          <div className="mv8">
            <Card>
              <div className="flex flex-wrap">
                <section className="w-100 flex flex-wrap justify-between">
                  <ConfirmContactDetails
                    contactDetails={returnRequest.customerProfileData}
                  />
                  <ConfirmPickupAddressDetails
                    pickupReturnData={returnRequest.pickupReturnData}
                  />
                </section>
                <section className="w-100 flex mt5">
                  <ConfirmPaymentMethods
                    refundPaymentData={returnRequest?.refundPaymentData}
                  />
                </section>
              </div>
            </Card>
          </div>
          <section className="flex justify-center">
            <div className="mr3">
              <Button
                size="small"
                variation="secondary"
                onClick={() => onPageChange('form-details')}
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
          </section>
        </>
      )}
    </PageBlock>
  )
}
