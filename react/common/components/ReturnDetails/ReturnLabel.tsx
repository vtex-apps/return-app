import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'
import { Collapsible, Link } from 'vtex.styleguide'

import { useReturnDetails } from '../../hooks/useReturnDetails'

const CSS_HANDLES = ['returnLabelContainer'] as const

const ReturnLabel = () => {
  const [isOpen, setIsOpen] = useState(false)
  const handles = useCssHandles(CSS_HANDLES)

  const { data } = useReturnDetails()

  const handleToggleCollapsible = () => {
    setIsOpen(!isOpen)
  }

  if (!data) return null

  const {
    pickupReturnData: { labelUrl },
  } = data.returnRequestDetails

  return (
    <div className={`${handles.returnLabelContainer} mv4`}>
      <div className="mb4">
        <Collapsible
          header={
            <div className="fw5">
              <FormattedMessage id="return-app.return-request-details.current-status.see-return-label" />
            </div>
          }
          isOpen={isOpen}
          onClick={handleToggleCollapsible}
        >
          <Link href={labelUrl} target="_blank">
            {labelUrl}
          </Link>
        </Collapsible>
      </div>
    </div>
  )
}

export { ReturnLabel }
