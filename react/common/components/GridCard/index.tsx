/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import './styles.css'

interface GridCardProps {
  cardTypeByPage?: 'my-returns' | 'request-return'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  item: any
}

const CSS_HANDLES = [
  'returnListItem',
  'returnListItemHeader',
  'returnListItemImage',
  'returnListItemInfo',
  'returnListItemInfoDate',
  'returnListItemInfoIdContainer',
  'returnListItemInfoStatus',
] as const

export const GridCard = ({
  cardTypeByPage = 'my-returns',
  item,
}: GridCardProps) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.returnListItem}>
      {cardTypeByPage === 'my-returns' && (
        <div className={handles.returnListItemHeader}>
          <span>
            <FormattedMessage id="store/return-app.request-return.page.card.sequential-number" />
          </span>
          <span>123456789</span>
        </div>
      )}

      {cardTypeByPage === 'request-return' && (
        <div className={handles.returnListItemHeader}>
          <span>ID:</span>
          <span>{item?.orderId ?? ''}</span>
        </div>
      )}

      <div className={handles.returnListItemImage}>
        <img src="https://fakeimg.pl/159x162/" alt="order image" />
      </div>

      <div className={handles.returnListItemInfo}>
        <span className={handles.returnListItemInfoDate}>
          <FormattedDate
            value="2023-12-31"
            day="2-digit"
            month="2-digit"
            year="numeric"
          />
        </span>

        {cardTypeByPage === 'my-returns' && (
          <>
            <div className={handles.returnListItemInfoIdContainer}>
              <span>ID:</span>
              <span>{item?.orderId ?? ''}</span>
            </div>
            <div className={handles.returnListItemInfoStatus}>
              <span>
                <FormattedMessage id="return-app.return-request-details.status-timeline.header" />
                :
              </span>
              <span>Novo</span>
            </div>
          </>
        )}

        {cardTypeByPage === 'request-return' && (
          <div className={handles.returnListItemInfoStatus}>
            <span>
              <FormattedMessage id="store/return-app.request-return.page.card.return-text" />
            </span>
            <span>
              {item?.invoicedItems?.length ?? 0}/
              {item?.invoicedItems?.length ?? 0}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
