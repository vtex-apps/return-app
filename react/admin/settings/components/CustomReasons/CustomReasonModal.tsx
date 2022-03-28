import type { ChangeEvent, FormEvent } from 'react'
import React, { useState, useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import type { CustomReturnReason } from 'vtex.return-app'
import { Modal, Input, Button } from 'vtex.styleguide'

import { useSettings } from '../../hooks/useSettings'
import type { CustomReasonWithIndex } from './CustomReasons'

interface CustomReasonModalProps {
  isOpen: boolean
  onClose: () => void
  editing: CustomReasonWithIndex | null
}

export const CustomReasonModal = ({
  isOpen,
  onClose,
  editing,
}: CustomReasonModalProps) => {
  const {
    appSettings: { maxDays, customReturnReasons },
    actions: { dispatch },
  } = useSettings()

  const [tempReason, setTempReason] = useState<CustomReturnReason>(
    {} as CustomReturnReason
  )

  const intl = useIntl()

  useEffect(() => {
    if (!editing) return
    // editing has index property, not accepted by Graphql.
    setTempReason({
      reason: editing.reason,
      maxDays: editing.maxDays,
      translations: editing.translations,
    })
  }, [editing])

  const handleTempReasonChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target

    setTempReason({
      ...tempReason,
      [name]: name === 'maxDays' ? Number(value) : value,
    })
  }

  const handleCloseModal = () => {
    setTempReason({} as CustomReturnReason)
    onClose()
  }

  const handleAddNewReason = (e: FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    let payload: CustomReturnReason[]

    if (editing) {
      payload =
        customReturnReasons?.map((reason, i) => {
          if (i === editing.index) {
            return tempReason
          }

          return reason
        }) ?? []
    } else {
      // Adding new one
      payload = customReturnReasons
        ? [...customReturnReasons, tempReason]
        : [tempReason]
    }

    dispatch({
      type: 'updateCustomReturnReasons',
      payload,
    })
    handleCloseModal()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleCloseModal}>
      <div className="flex flex-column">
        <div className="w-100">
          <h4 className="f3 fw3 gray mt6 mb2">
            <FormattedMessage id="admin/return-app.settings.section.custom-reasons.modal.custom-reason.header" />
          </h4>
        </div>
        <div className="w-100 mv4">
          <form
            onSubmit={handleAddNewReason}
            className="flex flex-column items-baseline"
          >
            <div className="w-100 mv3">
              <Input
                placeholder={intl.formatMessage({
                  id: 'admin/return-app.settings.section.custom-reasons.modal.custom-reason.placeholder',
                })}
                label={intl.formatMessage({
                  id: 'admin/return-app.settings.section.custom-reasons.modal.custom-reason.label',
                })}
                name="reason"
                size="large"
                required
                value={tempReason.reason ?? ''}
                onChange={handleTempReasonChange}
              />
            </div>
            <div className="w-100 mt3 mb6">
              <Input
                placeholder={intl.formatMessage({
                  id: 'admin/return-app.settings.section.custom-reasons.modal.custom-reason.placeholder',
                })}
                label={intl.formatMessage({
                  id: 'admin/return-app.settings.section.custom-reasons.modal.custom-reason.max-days.label',
                })}
                name="maxDays"
                size="large"
                type="number"
                min="1"
                max={maxDays}
                required
                value={tempReason.maxDays ?? ''}
                onChange={handleTempReasonChange}
              />
            </div>
            <Button type="submit">
              {editing ? (
                <FormattedMessage id="admin/return-app.settings.section.custom-reasons.modal.custom-reason.edit.button" />
              ) : (
                <FormattedMessage id="admin/return-app.settings.section.custom-reasons.modal.custom-reason.add-new.button" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </Modal>
  )
}
