import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { ButtonWithIcon, IconPlusLines, Table } from 'vtex.styleguide'

import { useSettings } from '../hooks/useSettings'
import { NewReasonModal } from './NewReasonModal'

const tableSchema = {
  properties: {
    reason: {
      title: 'Reason',
    },
    maxDays: {
      title: 'Max days',
    },
  },
}

export const CustomReasons = () => {
  const [isOpen, setIsOpen] = useState(false)
  const {
    appSettings: { customReturnReasons },
  } = useSettings()

  return (
    <section>
      <div className="flex items-end justify-between">
        <h3>
          <FormattedMessage id="admin/return-app.settings.section.custom-return-reasons.header" />
        </h3>
        <span>
          <ButtonWithIcon
            onClick={() => setIsOpen(true)}
            icon={<IconPlusLines />}
          >
            <FormattedMessage id="admin/return-app.settings.section.custom-reasons.add.button" />
          </ButtonWithIcon>
        </span>
      </div>
      <div>
        <Table
          fullWidth
          schema={tableSchema}
          items={customReturnReasons ?? []}
          emptyStateLabel={
            <FormattedMessage id="admin/return-app.settings.section.custom-reasons.empty-custom-reasons" />
          }
          emptyStateChildren={
            <>
              <p>
                <FormattedMessage id="admin/return-app.settings.section.custom-reasons.empty-custom-reasons.how-to" />
              </p>
              <p>
                <FormattedMessage id="admin/return-app.settings.section.custom-reasons.empty-custom-reasons.reasons.disclaimer" />
              </p>
            </>
          }
        />
      </div>
      <NewReasonModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </section>
  )
}
