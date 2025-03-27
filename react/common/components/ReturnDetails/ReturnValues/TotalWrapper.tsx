import type { ReactElement } from 'react'
import React from 'react'
import { FormattedNumber } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnDetails } from '../../../hooks/useReturnDetails'

const CSS_HANDLES = ['totalWrapperContainer'] as const

interface Props {
  title: ReactElement
  value: number
}

export const TotalWrapper = (props: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  const { title, value } = props

  const { data } = useReturnDetails()

  if (!data) return null

  const { cultureInfoData } = data?.returnRequestDetails

  return (
    <div
      className={`${handles.totalWrapperContainer} flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns`}
    >
      <div>
        <div className="c-muted-2 f6">{title}</div>
        <div className="w-100 mt2">
          <div className="f4 fw5 c-on-base">
            <FormattedNumber
              value={value / 100}
              style="currency"
              currency={cultureInfoData.currencyCode}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
