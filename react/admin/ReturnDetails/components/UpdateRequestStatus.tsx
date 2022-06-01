import type { FormEvent } from 'react'
import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { Dropdown, Textarea, Checkbox, Button } from 'vtex.styleguide'

export const UpdateRequestStatus = () => {
  const { formatMessage } = useIntl()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  const updateStatus = false

  return (
    <section>
      <h3>
        <FormattedMessage id="admin/return-app.return-request-details.update-status.title" />
      </h3>
      <form
        className="flex flex-column items-stretch w-50"
        onSubmit={handleSubmit}
      >
        <div className="mb6">
          <Dropdown
            size="small"
            placeholder={formatMessage({
              id: 'admin/return-app.return-request-details.update-status.dropdown.placeholder',
            })}
            options={[{ value: 1, label: 'test' }]}
            value=""
            onChange={() => {}}
          />
        </div>
        <div className="mb6">
          <Textarea
            label={
              <FormattedMessage id="admin/return-app.return-request-details.update-status.textarea.label" />
            }
            value=""
            onChange={() => {}}
          />
        </div>
        <div className="mb6">
          <Checkbox
            checked={false}
            label={
              <FormattedMessage id="admin/return-app.return-request-details.update-status.checkbox.label" />
            }
            onChange={() => {}}
          />
        </div>
        <div className="mb6">
          <Button type="submit" variation="primary" size="small">
            {updateStatus ? (
              <FormattedMessage id="admin/return-app.return-request-details.update-status.button.update-status" />
            ) : (
              <FormattedMessage id="admin/return-app.return-request-details.update-status.button.comment" />
            )}
          </Button>
        </div>
      </form>
    </section>
  )
}
