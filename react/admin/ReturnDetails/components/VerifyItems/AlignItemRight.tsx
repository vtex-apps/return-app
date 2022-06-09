import React from 'react'
import type { FC } from 'react'

export const AlignItemRight: FC = ({ children }) => (
  <span className="flex justify-end w-100">{children}</span>
)
