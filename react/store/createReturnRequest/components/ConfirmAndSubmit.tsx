import React from 'react'
import { useMutation } from 'react-apollo'
import type { MutationCreateReturnRequestArgs } from 'vtex.return-app'

import { useReturnRequest } from '../../hooks/useReturnRequest'
import type { Page } from '../ReturnDetailsContainer'
import CREATE_RETURN_REQUEST from '../graphql/createReturnRequest.gql'
import { isReturnRequestArgs } from '../../utils/isReturnRequestArgs'

interface Props {
  onPageChange: (page: Page) => void
}

export const ConfirmAndSubmit = ({ onPageChange }: Props) => {
  const { returnRequest } = useReturnRequest()

  const [createReturnRequest, { loading: creatingReturnRequest }] = useMutation<
    { returnRequestId: string },
    MutationCreateReturnRequestArgs
  >(CREATE_RETURN_REQUEST)

  const handleCreateReturnRequest = async () => {
    if (!isReturnRequestArgs(returnRequest) || creatingReturnRequest) return

    try {
      const { errors } = await createReturnRequest({
        variables: {
          returnRequest: {
            ...returnRequest,
            items: returnRequest.items.filter(({ quantity }) => quantity > 0),
          },
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
        {creatingReturnRequest ? 'Submitting' : 'Submit'}
      </button>
    </div>
  )
}
