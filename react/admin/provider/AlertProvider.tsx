import type { FC, ReactElement } from 'react'
import React, { createContext, useState, useCallback, useEffect } from 'react'
import { Alert } from 'vtex.styleguide'

type AlertStatus = 'success' | 'error'

interface AlertContextInterface {
  openAlert: (status: AlertStatus, message: string | ReactElement) => void
}

export const AlertContext = createContext<AlertContextInterface>(
  {} as AlertContextInterface
)

export const AlertProvider: FC = ({ children }) => {
  const [alertStatus, setAlertStatus] = useState<AlertStatus | ''>('')
  const [message, setMessage] = useState<string | ReactElement>('')

  const openAlert = (
    status: AlertStatus,
    alertMessage: string | ReactElement
  ) => {
    setAlertStatus(status)
    setMessage(alertMessage)
  }

  const handleClose = useCallback(() => {
    if (alertStatus) {
      setAlertStatus('')
      setMessage('')
    }
  }, [alertStatus])

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleClose()
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [handleClose, alertStatus])

  return (
    <AlertContext.Provider value={{ openAlert }}>
      {alertStatus ? (
        <div className="w-100 fixed z-max overflow-hidden">
          <div
            className="mt7"
            style={{ maxWidth: '520px', margin: '2rem auto' }}
          >
            <Alert type={alertStatus} onClose={handleClose}>
              {message}
            </Alert>
          </div>
        </div>
      ) : null}
      {children}
    </AlertContext.Provider>
  )
}
