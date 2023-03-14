/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useMemo, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'

import { GridCard } from '../../GridCard'
import SingleGridIcon from './icons/SingleGrid'
import DoubleGridIcon from './icons/DoubleGrid'

import './styles.css'

interface MobileListProps {
  cardTypeByPage?: 'my-returns' | 'request-return'
  // items: Maybe<Array<Maybe<OrderToReturnSummary>>> | ReturnRequestResponse[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any
}

const CSS_HANDLES = [
  'mobileReturnListContainer',
  'controlGridVisibility',
  'controlGridVisibilityButtons',
  'returnList',
  'returnListSingle',
  'returnListDouble',
  'emptyList',
] as const

const MobileList = ({
  cardTypeByPage = 'my-returns',
  items = [],
}: MobileListProps) => {
  const [showDoubleGridVisibility, setShowDoubleGridVisibility] = useState(true)

  const handles = useCssHandles(CSS_HANDLES)
  const hasItems = useMemo(() => items?.length > 0, [items])

  return (
    <div className={handles.mobileReturnListContainer}>
      {!hasItems && (
        <span className={handles.emptyList}>Nenhum resultado disponível</span>
      )}

      {hasItems && (
        <>
          <div className={handles.controlGridVisibility}>
            <span>Visualização:</span>
            <div className={handles.controlGridVisibilityButtons}>
              <button onClick={() => setShowDoubleGridVisibility(false)}>
                <SingleGridIcon filled={!showDoubleGridVisibility} />
              </button>
              <button onClick={() => setShowDoubleGridVisibility(true)}>
                <DoubleGridIcon filled={showDoubleGridVisibility} />
              </button>
            </div>
          </div>

          <div
            className={`${handles.returnList} ${
              showDoubleGridVisibility
                ? handles.returnListDouble
                : handles.returnListSingle
            }`}
          >
            {items?.map((item) => (
              <GridCard
                key={item?.orderId ?? ''}
                cardTypeByPage={cardTypeByPage}
                item={item}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default MobileList
