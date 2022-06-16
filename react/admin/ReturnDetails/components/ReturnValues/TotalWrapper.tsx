import type { ReactElement } from 'react'
import React from 'react'
import { FormattedCurrency } from 'vtex.format-currency'

interface Props {
  title: ReactElement
  value: number
}

export const TotalWrapper = ({ title, value }: Props) => {
  return (
    <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns">
      <div>
        <div className="c-muted-2 f6">{title}</div>
        <div className="w-100 mt2">
          <div className="f4 fw5 c-on-base">
            <FormattedCurrency value={value / 100} />
          </div>
        </div>
      </div>
    </div>
  )
}
