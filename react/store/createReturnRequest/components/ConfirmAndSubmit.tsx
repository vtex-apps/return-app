import React from 'react'
import { useMutation } from 'react-apollo'
import type {
  MutationCreateReturnRequestArgs,
  ReturnRequestInput,
} from 'vtex.return-app'

import type { Page } from '../ReturnDetailsContainer'
import CREATE_RETURN_REQUEST from '../graphql/createReturnRequest.gql'

interface Props {
  onPageChange: (page: Page) => void
  validatedReturnRequest: ReturnRequestInput | null
}

export const ConfirmAndSubmit = ({
  onPageChange,
  validatedReturnRequest,
}: Props) => {
  const [createReturnRequest, { loading: creatingReturnRequest }] = useMutation<
    { returnRequestId: string },
    MutationCreateReturnRequestArgs
  >(CREATE_RETURN_REQUEST)

  const handleCreateReturnRequest = async () => {
    if (!validatedReturnRequest || creatingReturnRequest) return

    try {
      const { errors } = await createReturnRequest({
        variables: {
          returnRequest: validatedReturnRequest,
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
