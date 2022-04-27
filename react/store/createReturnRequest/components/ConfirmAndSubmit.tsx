import React from 'react'

import { useReturnRequest } from '../../hooks/useReturnRequest'
import type { Page } from '../ReturnDetailsContainer'

interface Props {
  onPageChange: (page: Page) => void
}

export const ConfirmAndSubmit = ({ onPageChange }: Props) => {
  const { returnRequest } = useReturnRequest()

  return (
    <div>
      <h1>ConfirmReturnDetails</h1>
      <button onClick={() => onPageChange('form-details')}>Prev</button>
      <button
        onClick={() => {
          // eslint-disable-next-line no-console
          console.log({ returnRequest })
        }}
      >
        Submit
      </button>
    </div>
  )
}
