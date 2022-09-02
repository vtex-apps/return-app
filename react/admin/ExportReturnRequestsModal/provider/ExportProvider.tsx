import React, { createContext, useState, useEffect } from 'react'
import type { FC } from 'react'
import { useQuery, useMutation } from 'react-apollo'
import type { ApolloError } from 'apollo-client'
import type {
  ExportReturnRequestsInput,
  ExportReportData,
  MutationExportReturnRequestsArgs,
} from 'vtex.return-app'

import EXPORT_RETURN_REQUESTS from '../graphql/exportReturnRequests.gql'
import GET_EXPORT_STATUS from '../graphql/getExportStatus.gql'

interface ExportContextInterface {
  exportStatus?: ExportReportData | null
  loadingStatus: boolean
  submitInProgress: boolean
  tagStatus: ExportStatusValues
  error?: ApolloError
  _handleExport: (exportData: ExportReturnRequestsInput) => void
}

export const ExportContext = createContext<ExportContextInterface>(
  {} as ExportContextInterface
)

const EXPORT_POLLING_MS = 1000

export const TAG_STATUSES = {
  READY: 'status-ready',
  INPROGRESS: 'status-in-progress',
  ERROR: 'status-error',
} as const

type ExportStatusKeys = keyof typeof TAG_STATUSES
type ExportStatusValues = typeof TAG_STATUSES[ExportStatusKeys]

export const ExportProvider: FC = ({ children }) => {
  /**
   * Sadly the notify network feature for Apollo only announces when
   * a polling is IN PROGRESS, and not when we are in a 'polling' state
   */
  const [isPolling, setPollingStatus] = useState(false)
  const [tagStatus, setTagStatus] = useState<ExportStatusValues>(
    TAG_STATUSES.READY
  )

  const {
    data,
    loading: loadingStatus,
    error,
    startPolling,
    stopPolling,
    updateQuery,
  } = useQuery<{
    exportStatus: ExportReportData | null
  }>(GET_EXPORT_STATUS, { fetchPolicy: 'network-only' })

  const { exportStatus } = data ?? {}
  const { id, inProgress, lastErrorMessage } = exportStatus ?? {}

  const [exportReturnRequests, { loading: submitInProgress }] = useMutation<
    {
      exportReturnRequests: ExportReportData
    },
    MutationExportReturnRequestsArgs
  >(EXPORT_RETURN_REQUESTS)

  useEffect(() => {
    if (error || lastErrorMessage) {
      setTagStatus(TAG_STATUSES.ERROR)

      return
    }

    if ((!id || !inProgress) && !error && !lastErrorMessage) {
      setTagStatus(TAG_STATUSES.READY)

      return
    }

    if (inProgress) {
      setTagStatus(TAG_STATUSES.INPROGRESS)
    }
  }, [error, id, inProgress, lastErrorMessage])

  useEffect(() => {
    if (
      (isPolling && inProgress === false) ||
      (isPolling && lastErrorMessage)
    ) {
      stopPolling()
    }

    if (!isPolling && inProgress && !lastErrorMessage) {
      startPolling(EXPORT_POLLING_MS)
    }
  }, [isPolling, stopPolling, lastErrorMessage, startPolling, inProgress])

  const _handleExport = async (exportData: ExportReturnRequestsInput) => {
    try {
      const { errors, data: mutationData } = await exportReturnRequests({
        variables: {
          exportData,
        },
      })

      if (!mutationData || errors) {
        throw new Error(
          `An unexpected error ocurred: ${
            errors ? errors.toString() : 'No mutation data received'
          }`
        )
      }

      updateQuery(() => ({
        exportStatus: { ...mutationData.exportReturnRequests },
      }))
      setPollingStatus(true)
      startPolling(EXPORT_POLLING_MS)
    } catch (e) {
      console.error(e)
      setTagStatus(TAG_STATUSES.ERROR)
    }
  }

  return (
    <ExportContext.Provider
      value={{
        exportStatus,
        loadingStatus,
        submitInProgress,
        error,
        tagStatus,
        _handleExport,
      }}
    >
      {children}
    </ExportContext.Provider>
  )
}
