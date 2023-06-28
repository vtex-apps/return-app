/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useMemo, useState } from 'react'
import { useCssHandles } from 'vtex.css-handles'
import { FormattedMessage } from 'react-intl'

import { GridCard } from '../../GridCard'
import SingleGridIcon from './icons/SingleGrid'
import DoubleGridIcon from './icons/DoubleGrid'

import './styles.css'

interface MobileListProps {
  cardTypeByPage?: 'my-returns' | 'request-return'
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
        <span className={handles.emptyList}>
          <FormattedMessage id="store/return-app.return-request-list.table.emptyState" />
        </span>
      )}

      {hasItems && (
        <>
          <div className={handles.controlGridVisibility}>
            <span>
              <FormattedMessage id="store/return-app.return-request-list.table.view" />
            </span>
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
