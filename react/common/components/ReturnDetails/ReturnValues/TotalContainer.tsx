import type { FC } from 'react'
import React from 'react'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['totalContainer'] as const

export const TotalContainer: FC = ({ children }) => {
  const handles = useCssHandles(CSS_HANDLES)

  return (
    <div
      className={`${handles.totalContainer} w-100 flex flex-row-ns ba br3 b--muted-4 flex-column`}
    >
      {children}
    </div>
  )
}
