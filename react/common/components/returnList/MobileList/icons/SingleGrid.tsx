import React from 'react'

interface SingleGridIconProps {
  filled?: boolean
}

const SingleGridIcon = ({ filled = false }: SingleGridIconProps) => {
  return (
    <svg
      width="16"
      height="20"
      viewBox="0 0 16 20"
      fill={filled ? '#FF3333' : 'none'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="0.5"
        y="0.5"
        width="15"
        height="19"
        fill={filled ? '#FF3333' : 'none'}
        stroke="#FF3333"
        strokeOpacity="0.4"
      />
    </svg>
  )
}

export default SingleGridIcon
