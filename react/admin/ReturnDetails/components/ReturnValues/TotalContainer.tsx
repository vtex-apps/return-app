import type { FC } from 'react'
import React from 'react'

export const TotalContainer: FC = ({ children }) => {
  return (
    <div className="w-100 flex flex-row-ns ba br3 b--muted-4 flex-column">
      {children}
    </div>
  )
}
