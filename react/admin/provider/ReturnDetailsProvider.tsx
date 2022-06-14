import type { FC } from 'react'
import React, { createContext } from 'react'
import type { ApolloError } from 'apollo-client'
import { useQuery, useMutation } from 'react-apollo'
import type {
  ReturnRequestResponse,
  QueryReturnRequestArgs,
  MutationUpdateReturnRequestStatusArgs,
  ReturnRequestCommentInput,
  Status,
  RefundDataInput,
} from 'vtex.return-app'
import { FormattedMessage } from 'react-intl'

import GET_REQUEST_DETAILS_ADMIN from '../graphql/getRequestDetailsAdmin.gql'
import UPDATE_RETURN_STATUS from '../graphql/updateReturnRequestStatus.gql'
import { useAlert } from '../hooks/userAlert'

interface ReturnDetailsSetupInterface {
  data?: { returnRequestDetails: ReturnRequestResponse }
  loading: boolean
  error?: ApolloError
  submitting: boolean
  handleStatusUpdate: (args: HandleStatusUpdateArgs) => Promise<void>
}

interface HandleStatusUpdateArgs {
  status: Status
  id: string
  comment?: ReturnRequestCommentInput
  cleanUp?: () => void
  refundData?: RefundDataInput
}
export interface CustomRouteProps {
  requestId: string
}

export const ReturnDetailsContext = createContext<ReturnDetailsSetupInterface>(
  {} as ReturnDetailsSetupInterface
)

export const ReturnDetailsProvider: FC<CustomRouteProps> = ({
  requestId,
  children,
}) => {
  const { openAlert } = useAlert()
  const { data, loading, error, updateQuery } = useQuery<
    { returnRequestDetails: ReturnRequestResponse },
    QueryReturnRequestArgs
  >(GET_REQUEST_DETAILS_ADMIN, {
    variables: {
      requestId,
    },
    skip: !requestId,
  })

  const [updateReturnStatus, { loading: submitting }] = useMutation<
    {
      updateReturnRequestStatus: ReturnRequestResponse
    },
    MutationUpdateReturnRequestStatusArgs
  >(UPDATE_RETURN_STATUS)

  const handleStatusUpdate = async (args: HandleStatusUpdateArgs) => {
    const { id, status, comment, cleanUp, refundData } = args

    try {
      const { errors, data: mutationData } = await updateReturnStatus({
        variables: {
          requestId: id,
          status,
          ...(comment ? { comment } : {}),
          ...(refundData ? { refundData } : {}),
        },
      })

      if (errors) {
        throw new Error('Error updating return request status')
      }

      openAlert(
        'success',
        <FormattedMessage id="admin/return-app.return-request-details.update-status.alert.success" />
      )

      cleanUp?.()
      if (!mutationData) return
      updateQuery(() => ({
        returnRequestDetails: mutationData.updateReturnRequestStatus,
      }))
    } catch {
      openAlert(
        'error',
        <FormattedMessage id="admin/return-app.return-request-details.update-status.alert.error" />
      )
    }
  }

  return (
    <ReturnDetailsContext.Provider
      value={{ data, loading, error, submitting, handleStatusUpdate }}
    >
      {children}
    </ReturnDetailsContext.Provider>
  )
}
