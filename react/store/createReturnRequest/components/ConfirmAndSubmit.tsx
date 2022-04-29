import React from 'react'
import { useMutation } from 'react-apollo'
import type { MutationCreateReturnRequestArgs } from 'vtex.return-app'

import type { Page } from '../ReturnDetailsContainer'
import CREATE_RETURN_REQUEST from '../graphql/createReturnRequest.gql'
import { useReturnRequest } from '../../hooks/useReturnRequest'

interface Props {
  onPageChange: (page: Page) => void
}

export const ConfirmAndSubmit = ({ onPageChange }: Props) => {
  const { validatedRmaFields } = useReturnRequest()
  const [createReturnRequest, { loading: creatingReturnRequest }] = useMutation<
    { returnRequestId: string },
    MutationCreateReturnRequestArgs
  >(CREATE_RETURN_REQUEST)

  const handleCreateReturnRequest = async () => {
    if (!validatedRmaFields || creatingReturnRequest) return

    try {
      const { errors } = await createReturnRequest({
        variables: {
          returnRequest: validatedRmaFields,
        },
      })

      if (errors) {
        // TODO: handle validation errors coming from the server
        throw new Error('Error creating return request')
      }
    } catch (error) {
      console.error({ error })
    }
  }

  return (
    <div>
      <h1>ConfirmReturnDetails</h1>
      <button onClick={() => onPageChange('form-details')}>Prev</button>
      <button onClick={handleCreateReturnRequest}>
        {/* TODO INTL */}
        {creatingReturnRequest ? 'Submitting' : 'Submit'}
      </button>
    </div>
  )
}
