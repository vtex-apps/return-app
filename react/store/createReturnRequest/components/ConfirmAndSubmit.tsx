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
// import { ReturnInformationTable } from './ReturnInformationTable'

interface Props {
  onPageChange: (page: Page) => void
}

export const ConfirmAndSubmit = ({ onPageChange }: Props) => {
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

  // eslint-disable-next-line no-console
  console.log(returnRequest, 'returnRequest')

  return (
    <PageBlock className="ph0 mh0 pa0 pa0-ns">
      {/* TODO INTL */}
      <PageHeader className="ph0 mh0 nl5" title="Confirm Return Details" />
      {requestId ? (
        <div>{requestId}</div>
      ) : (
        <>
          {/* <ReturnInformationTable items={returnRequest.items} /> */}
          <table className="w-100">
            <thead className="w-100 ph4 truncate overflow-x-hidden c-muted-2 f6">
              <tr className="w-100 truncate overflow-x-hidden">
                <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
                  <FormattedMessage id="store/return-app.return-order-details.table-header.product" />
                </th>
                <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
                  <FormattedMessage id="store/return-app.return-order-details.table-header.quantity-to-return" />
                </th>
              </tr>
            </thead>
            <tbody className="v-mid">
              {returnRequest.items.map(({ name, quantity, imageUrl }) => {
                return quantity ? (
                  <tr className="ph5">
                    <td className="w-50 pv5">
                      <div className="flex ml2">
                        <img src={imageUrl} alt="Product" />
                        <p>{name}</p>
                      </div>
                    </td>
                    <td className="w-50 tc pv5">
                      <p>{quantity}</p>
                    </td>
                  </tr>
                ) : null
              })}
            </tbody>
          </table>
          <div className="mv8">
            <Card>
              <div className="flex flex-wrap">
                <section className="w-100 flex flex-wrap justify-between">
                  <section className="w-40">
                    <h2 className="mt0 mb6">Contact Details</h2>
                    <p className="f6 gray">
                      {returnRequest.customerProfileData.name}
                    </p>
                    <p className="f6 gray">
                      {returnRequest.customerProfileData.email}
                    </p>
                    <p className="f6 gray">
                      {returnRequest.customerProfileData.phoneNumber}
                    </p>
                  </section>
                  <div className="w-40">
                    <h2 className="mt0 mb6">Pickup Address</h2>
                    <p className="f6 gray">
                      {returnRequest.pickupReturnData.address}
                    </p>
                    <p className="f6 gray">
                      {returnRequest.pickupReturnData.city}
                    </p>
                    <p className="f6 gray">
                      {returnRequest.pickupReturnData.state}
                    </p>
                    <p className="f6 gray">
                      {returnRequest.pickupReturnData.zipCode}
                    </p>
                    <p className="f6 gray">
                      {returnRequest.pickupReturnData.country}
                    </p>
                  </div>
                </section>
                <section className="w-100 flex mt5">
                  <div className="w-40">
                    <h2 className="mt0 mb6">Refund Method</h2>
                    <p className="f6 gray ">
                      {returnRequest.refundPaymentData.refundPaymentMethod}
                    </p>
                  </div>
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
                Prev
              </Button>
            </div>
            <div className="ml3">
              <Button
                size="small"
                onClick={handleCreateReturnRequest}
                isLoading={creatingReturnRequest}
              >
                {/* TODO INTL */}
                Submit
              </Button>
            </div>
          </section>
        </>
      )}
    </PageBlock>
  )
}
