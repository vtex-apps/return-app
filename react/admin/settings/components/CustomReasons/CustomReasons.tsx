import type { ReactElement } from 'react'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import {
  ButtonWithIcon,
  IconPlusLines,
  Table,
  ModalDialog,
} from 'vtex.styleguide'

import type { CustomReturnReason } from '../../../../../typings/ReturnAppSettings'
import { useSettings } from '../../hooks/useSettings'
import { CustomReasonModal } from './CustomReasonModal'
import { TranslationsModal } from './TranslationsModal'

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
      title: (
        <FormattedMessage id="admin/return-app.settings.section.custom-reasons.table.header.reason" />
      ),
    },
    maxDays: {
      title: (
        <FormattedMessage id="admin/return-app.settings.section.custom-reasons.table.header.max-days" />
      ),
    },
  },
}

interface LineActionsArgs {
  handleDeleteCustomReason: (reason: number) => void
  handleEditCustomReason: (customReason: CustomReasonWithIndex) => void
  handleOpenTranslations: (customReason: CustomReasonWithIndex) => void
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
  handleOpenTranslations,
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
        handleOpenTranslations(rowData)
      },
    },
  ]
}

export const CustomReasons = () => {
  const [modalOpen, setModalOpen] = useState<
    'add' | 'edit' | 'translations' | ''
  >('')

  const [indexToDelete, setIndexToDelete] = useState<number | null>(null)
  const [customReasonToEdit, setCustomReasonToEdit] =
    useState<CustomReasonWithIndex | null>(null)

  const { appSettings, actions } = useSettings()

  const { customReturnReasons } = appSettings || {}
  const { dispatch } = actions || {}

  const handleDeleteCustomReason = (reasonIndex: number) => {
    setIndexToDelete(reasonIndex)
  }

  const handleEditCustomReason = (customReason: CustomReasonWithIndex) => {
    setCustomReasonToEdit(customReason)
    setModalOpen('edit')
  }

  const handleOpenTranslations = (customReason: CustomReasonWithIndex) => {
    setCustomReasonToEdit(customReason)
    setModalOpen('translations')
  }

  const handleStateCleanup = () => {
    setCustomReasonToEdit(null)
    setModalOpen('')
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
            onClick={() => setModalOpen('add')}
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
            handleOpenTranslations,
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
      <CustomReasonModal
        isOpen={modalOpen === 'add' || modalOpen === 'edit'}
        modalOpen={modalOpen}
        onClose={handleStateCleanup}
        customReasonOnFocus={customReasonToEdit}
      />
      {/* Modal to confirm delete operation. It has to check === null because indexToDelete can be zero */}
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
                b: (chunks: ReactElement) => <b>{chunks}</b>,
              }}
            />
          </p>
        </ModalDialog>
      )}
      <TranslationsModal
        customReasonOnFocus={customReasonToEdit}
        isOpen={modalOpen === 'translations'}
        onClose={handleStateCleanup}
      />
    </section>
  )
}
