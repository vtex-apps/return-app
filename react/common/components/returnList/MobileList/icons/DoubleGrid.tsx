import React from 'react'

interface DoubleGridIconProps {
  filled?: boolean
}

const DoubleGridIcon = ({ filled = false }: DoubleGridIconProps) => {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="6"
        height="19"
        fill={filled ? '#FF3333' : 'none'}
        stroke="#FF3333"
      />
      <rect
        x="9.5"
        y="0.5"
        width="6"
        height="19"
        fill={filled ? '#FF3333' : 'none'}
        stroke="#FF3333"
      />
    </svg>
  )
}

export default DoubleGridIcon
