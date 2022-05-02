import React, { useState } from 'react'
import { useMutation } from 'react-apollo'
import type {
  MutationCreateReturnRequestArgs,
  ReturnRequestCreated,
} from 'vtex.return-app'

import type { Page } from '../ReturnDetailsContainer'
import CREATE_RETURN_REQUEST from '../graphql/createReturnRequest.gql'
import { useReturnRequest } from '../../hooks/useReturnRequest'

interface Props {
  onPageChange: (page: Page) => void
}

export const ConfirmAndSubmit = ({ onPageChange }: Props) => {
  const { validatedRmaFields } = useReturnRequest()
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
    <div>
      <h1>ConfirmReturnDetails</h1>
      {requestId ? (
        <div>{requestId}</div>
      ) : (
        <>
          <button onClick={() => onPageChange('form-details')}>Prev</button>
          <button onClick={handleCreateReturnRequest}>
            {/* TODO INTL */}
            {creatingReturnRequest ? 'Submitting' : 'Submit'}
          </button>
        </>
      )}
    </div>
  )
}
