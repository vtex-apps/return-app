import React from 'react'
import type { FC, ReactElement } from 'react'
import type { ApolloError } from 'apollo-client'
import { EmptyState, Spinner } from 'vtex.styleguide'

interface Props {
  error?: ApolloError
  loading: boolean
  data?: unknown
  errorMessages: {
    errorTitle: ReactElement
    errorDescription?: ReactElement
  }
}

export const AdminLoader: FC<Props> = ({
  error,
  loading,
  data,
  errorMessages,
  children,
}) => {
  if (error) {
    return (
      <EmptyState title={errorMessages.errorTitle}>
        {errorMessages.errorDescription}
      </EmptyState>
    )
  }

  if (loading || !data) {
    return (
      <EmptyState>
        <Spinner />
      </EmptyState>
    )
  }

  return <>{children}</>
}
