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
  const [open, setOpen] = useState<AlertStatus | ''>('')
  const [message, setMessage] = useState<string>('')

  const openAlert = (status: AlertStatus, alertMessage) => {
    setOpen(status)
    setMessage(alertMessage)
  }

  const handleClose = useCallback(() => {
    if (open) {
      setOpen('')
      setMessage('')
    }
  }, [open])

  useEffect(() => {
    const timeout = setTimeout(() => {
      handleClose()
    }, 5000)

    return () => {
      clearTimeout(timeout)
    }
  }, [handleClose, open])

  return (
    <AlertContext.Provider value={{ openAlert }}>
      {open ? (
        <div className="w-100 fixed z-max overflow-hidden">
          <div
            className="mt7"
            style={{ maxWidth: '520px', margin: '2rem auto' }}
          >
            <Alert type="success" onClose={handleClose}>
              {message}
            </Alert>
          </div>
        </div>
      ) : null}
      {children}
    </AlertContext.Provider>
  )
}
