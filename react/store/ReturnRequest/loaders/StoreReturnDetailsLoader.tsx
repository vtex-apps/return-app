import type { FC } from 'react'
import React from 'react'
import type { ApolloError } from 'apollo-client'
import { Alert } from 'vtex.styleguide'

interface Props {
  data: {
    loading: boolean
    error?: ApolloError
  }
}

export const StoreReturnDetailsLoader: FC<Props> = ({ data, children }) => {
  const { loading, error } = data

  return (
    <>
      {!loading && !error ? (
        children
      ) : error ? (
        <Alert type="error">{error}</Alert>
      ) : (
        <>Loading</>
      )}
    </>
  )
}
