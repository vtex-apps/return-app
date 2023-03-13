/* eslint-disable jsx-a11y/img-redundant-alt */
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = [
  'mobileReturnListContainer',
  'controlGridVisibility',
  'controlGridVisibilityButtons',
  'gridSingle',
  'gridDouble',
  'returnList',
  'returnListItem',
  'returnListItemHeader',
  'returnListItemImage',
  'returnListItemInfo',
  'returnListItemInfoDate',
  'returnListItemInfoIdContainer',
  'returnListItemInfoStatus',
] as const

const MobileList = () => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div className={handles.mobileReturnListContainer}>
      <div className={handles.controlGridVisibility}>
        <span>Visualização:</span>
        <div className={handles.controlGridVisibilityButtons}>
          <button className={handles.gridSingle}>[]</button>
          <button className={handles.gridDouble}>[][]</button>
        </div>
      </div>

      <div className={handles.returnList}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={handles.returnListItem}>
            <div className={handles.returnListItemHeader}>
              <span>nº sequencial</span>
              <span>12345678</span>
            </div>

            <div className={handles.returnListItemImage}>
              <img src="https://fakeimg.pl/159x162/" alt="order image" />
            </div>

            <div className={handles.returnListItemInfo}>
              <span className={handles.returnListItemInfoDate}>30/12/2023</span>
              <div className={handles.returnListItemInfoIdContainer}>
                <span>ID:</span>
                <span>123456789-120</span>
              </div>
              <div className={handles.returnListItemInfoStatus}>
                <span>Status:</span>
                <span>Novo</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MobileList
