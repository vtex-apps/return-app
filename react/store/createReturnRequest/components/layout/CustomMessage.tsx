import type { ReactElement } from 'react'
import React from 'react'
import { IconWarning } from 'vtex.styleguide'

interface Props {
  status: string
  message: ReactElement
}

export const CustomMessage = ({ status, message }: Props) => {
  return (
    <section className="flex items-center mt2">
      <div
        className={`flex items-center ${
          status === 'error' ? 'bg-washed-red' : 'bg-washed-yellow'
        } br2-s`}
      >
        <span
          className={`${
            status === 'error' ? 'c-danger' : ' c-warning'
          } flex items-center ml3`}
        >
          <IconWarning size={14} />
        </span>
        <p className="t-small ma2">{message}</p>
      </div>
    </section>
  )
}
