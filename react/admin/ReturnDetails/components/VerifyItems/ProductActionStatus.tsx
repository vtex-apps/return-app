import React from 'react'
import { IconSuccess, IconFailure, IconWarning } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

type ActionStatus = 'deny' | 'approve' | 'partially-approve'

const getActionStatus = ({
  quantity,
  selectedQuantity,
}: {
  quantity: number
  selectedQuantity: number
}): ActionStatus =>
  selectedQuantity === 0
    ? 'deny'
    : selectedQuantity === quantity
    ? 'approve'
    : 'partially-approve'

export const ProductActionStatus = ({
  quantity,
  selectedQuantity,
}: {
  quantity: number
  selectedQuantity: number
}) => {
  const actionStatus = getActionStatus({ quantity, selectedQuantity })

  return (
    <>
      {actionStatus !== 'approve' ? null : (
        <div className="c-success flex items-center">
          <span className="mr2 flex">
            <IconSuccess size={14} />
          </span>
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.approve" />
        </div>
      )}
      {actionStatus !== 'deny' ? null : (
        <div className="c-danger flex items-center">
          <span className="mr2 flex">
            <IconFailure size={14} />
          </span>
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.deny" />
        </div>
      )}
      {actionStatus !== 'partially-approve' ? null : (
        <div className="c-warning flex items-center">
          <span className="mr2 flex">
            <IconWarning size={14} />
          </span>
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.partially-approve" />
        </div>
      )}
    </>
  )
}
