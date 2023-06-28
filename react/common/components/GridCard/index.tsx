/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { useMemo } from 'react'
import { FormattedMessage, FormattedDate } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { useRuntime } from 'vtex.render-runtime/'

import { renderStatus } from '../RenderStatus'

import './styles.css'

interface GridCardProps {
  cardTypeByPage?: 'my-returns' | 'request-return'
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
  const { navigate } = useRuntime()

  const navigateToCorrectReturnPage = () => {
    if (cardTypeByPage === 'request-return') {
      navigate({
        to: `#/my-returns/add/${item?.orderId ?? ''}`,
      })
    } else {
      navigate({
        to: `#/my-returns/details/${item?.id ?? ''}`,
      })
    }
  }

  const availableItemsToReturnCount = useMemo(() => {
    return (
      (item?.invoicedItems?.length ?? 0) - (item?.processedItems?.length ?? 0)
    )
  }, [item])

  let itemImage =
    cardTypeByPage === 'request-return'
      ? item?.invoicedItems?.[0]?.imageUrl ?? ''
      : item?.items?.[0]?.imageUrl ?? ''

  /**
   * Matches the id of an image and captures the width and height
   * @example ids/167082-880-880/ -> -880-880
   */
  const replaceImageSize = itemImage?.match(/ids\/[^-]*(.*)\//)

  itemImage = replaceImageSize
    ? itemImage.replace(replaceImageSize[1], `-200-200`)
    : itemImage

  return (
    <div
      onClick={navigateToCorrectReturnPage}
      className={handles.returnListItem}
      aria-hidden="true"
    >
      {cardTypeByPage === 'my-returns' && (
        <div className={handles.returnListItemHeader}>
          <span>
            <FormattedMessage id="store/return-app.request-return.page.card.sequential-number" />
          </span>
          <span>{item?.sequenceNumber ?? '123456-7'}</span>
        </div>
      )}

      {cardTypeByPage === 'request-return' && (
        <div className={handles.returnListItemHeader}>
          <span>ID:</span>
          <span>{item?.orderId ?? ''}</span>
        </div>
      )}

      <div className={handles.returnListItemImage}>
        <img src={itemImage ?? '#'} alt="order image" />
      </div>

      <div className={handles.returnListItemInfo}>
        <span className={handles.returnListItemInfoDate}>
          <FormattedDate
            value={item?.creationDate ?? new Date()}
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
                <FormattedMessage id="store/return-app.return-request-details.status-timeline.header" />
                :
              </span>
              {!!item?.status && <span>{renderStatus(item.status)}</span>}
            </div>
          </>
        )}

        {cardTypeByPage === 'request-return' && (
          <div className={handles.returnListItemInfoStatus}>
            <span>
              <FormattedMessage id="store/return-app.request-return.page.card.return-text" />
            </span>
            <span>
              {availableItemsToReturnCount ?? 0}/
              {item?.invoicedItems?.length ?? 0}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}
