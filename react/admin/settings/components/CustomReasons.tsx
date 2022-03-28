import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import type { CustomReturnReason } from 'vtex.return-app'
import {
  ButtonWithIcon,
  IconPlusLines,
  Table,
  ModalDialog,
} from 'vtex.styleguide'

import { useSettings } from '../hooks/useSettings'
import { NewReasonModal } from './CustomReasonModal'

const addIndexToCustomReason = (
  customReturnReasons: CustomReturnReason[] | undefined | null
) =>
  customReturnReasons?.map((reason, i) => ({
    ...reason,
    index: i,
  })) ?? []

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

interface LineActionsArgs {
  handleDeleteCustomReason: (reason: number) => void
  handleEditCustomReason: (customReason: CustomReasonWithIndex) => void
}

export type CustomReasonWithIndex = ReturnType<
  typeof addIndexToCustomReason
>[number]

interface RowData {
  rowData: CustomReasonWithIndex
}

const lineActions = ({
  handleDeleteCustomReason,
  handleEditCustomReason,
}: LineActionsArgs) => {
  return [
    {
      label: () => 'Edit',
      onClick: ({ rowData }: RowData) => {
        handleEditCustomReason(rowData)
      },
    },
    {
      label: () => 'Delete',
      isDangerous: true,
      onClick: ({ rowData }: RowData) => {
        handleDeleteCustomReason(rowData.index)
      },
    },
    {
      label: () => 'Translations',
      onClick: ({ rowData }: RowData) => {
        // eslint-disable-next-line no-console
        console.log('Translations', { rowData })
      },
    },
  ]
}

export const CustomReasons = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [indexToDelete, setIndexToDelete] = useState<number | null>(null)
  const [customReasonToEdit, setCustomReasonToEdit] =
    useState<CustomReasonWithIndex | null>(null)

  const {
    appSettings: { customReturnReasons },
    actions: { dispatch },
  } = useSettings()

  const handleDeleteCustomReason = (reasonIndex: number) => {
    setIndexToDelete(reasonIndex)
  }

  const handleEditCustomReason = (customReason: CustomReasonWithIndex) => {
    setCustomReasonToEdit(customReason)
    setIsOpen(true)
  }

  const handleCloseCustomReasonModal = () => {
    setCustomReasonToEdit(null)
    setIsOpen(false)
  }

  const confirmDelete = () => {
    const newCustomReturnReasons = customReturnReasons?.filter(
      (_, i) => i !== indexToDelete
    )

    setIndexToDelete(null)

    dispatch({
      type: 'updateCustomReturnReasons',
      payload: newCustomReturnReasons ?? [],
    })
  }

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
          // Add index to custom reasons so it can be used on edit and delete operations
          items={addIndexToCustomReason(customReturnReasons)}
          lineActions={lineActions({
            handleDeleteCustomReason,
            handleEditCustomReason,
          })}
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
      <NewReasonModal
        isOpen={isOpen}
        onClose={handleCloseCustomReasonModal}
        editing={customReasonToEdit}
      />
      {/* it has to check === null because indexToDelete can be zero */}
      {indexToDelete === null ? null : (
        <ModalDialog
          centered
          isOpen={indexToDelete !== null}
          onClose={() => setIndexToDelete(null)}
          confirmation={{
            label: (
              <FormattedMessage id="admin/return-app.settings.section.custom-reasons.modal.delete.custom-reason.confirm" />
            ),
            onClick: confirmDelete,
            isDangerous: true,
          }}
          cancelation={{
            label: (
              <FormattedMessage id="admin/return-app.settings.section.custom-reasons.modal.delete.custom-reason.cancel" />
            ),
            onClick: () => setIndexToDelete(null),
          }}
        >
          <p className="f3 fw3 f3-ns">
            <FormattedMessage
              id="admin/return-app.settings.section.custom-reasons.modal.delete.custom-reason.message"
              values={{
                reason: customReturnReasons?.[indexToDelete]?.reason,
                // eslint-disable-next-line react/display-name
                b: (chunks: string) => <b>{chunks}</b>,
              }}
            />
          </p>
        </ModalDialog>
      )}
    </section>
  )
}
