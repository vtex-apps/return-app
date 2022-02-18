import React from 'react'
import type { FormEvent } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, Input, DatePicker, ButtonWithIcon } from 'vtex.styleguide'

import { FormattedMessageFixed, getStatusTranslation } from '../../common/utils'
import { StatusDropDownMenu } from '../../components/StatusDropDownMenu'
import type { initialFilters } from '../../common/constants/returnsTable'

type FilterBy = keyof typeof initialFilters

const ReturnTableFrom = ({
  filters,
  handleApplyFilters,
  filterByKey,
  handleResetFilters,
  isFiltered,
}) => {
  const handleOnChangeForm = (event: FormEvent) => {
    const { name, value } = event.target as EventTarget & {
      name: FilterBy
      value: string
    }

    filterByKey(name, value)
  }

  const onSubmitForm = (event: FormEvent) => {
    event.preventDefault()
    const { toDate, fromDate } = filters

    if (fromDate && !toDate) {
      /**
       * @description in this case fromDate is not empty and toDate is empty
       */
      filterByKey('toDate', fromDate)
    }

    handleApplyFilters(event)
  }

  const statusLabel =
    filters.status !== '' ? (
      <FormattedMessageFixed
        id={`returns.status${getStatusTranslation(filters.status)}`}
      />
    ) : (
      <FormattedMessage id="returns.statusAllStatuses" />
    )

  return (
    <form onSubmit={onSubmitForm} onChange={handleOnChangeForm}>
      <div className="flex items-center">
        <div className="ma2">
          <FormattedMessage id="returns.requestId">
            {(msg) => (
              <Input
                placeholder={msg}
                size="small"
                name="returnId"
                value={filters.returnId}
              />
            )}
          </FormattedMessage>
        </div>
        <div className="ma2">
          <FormattedMessage id="returns.sequenceNumber">
            {(msg) => (
              <Input
                placeholder={msg}
                size="small"
                name="sequenceNumber"
                value={filters.sequenceNumber}
              />
            )}
          </FormattedMessage>
        </div>
        <div className="ma2">
          <FormattedMessage id="returns.orderId">
            {(msg) => (
              <Input
                placeholder={msg}
                size="small"
                name="orderId"
                value={filters.orderId}
              />
            )}
          </FormattedMessage>
        </div>
        <div className="ma2">
          <FormattedMessage id="returns.filterFromDate">
            {(msg) => (
              <DatePicker
                maxDate={new Date()}
                placeholder={msg}
                locale="en-GB"
                size="small"
                onChange={(date: string) => filterByKey('fromDate', date)}
                value={filters.fromDate}
              />
            )}
          </FormattedMessage>
        </div>
        <div className="ma2">
          <FormattedMessage id="returns.filterToDate">
            {(msg) => (
              <DatePicker
                maxDate={new Date()}
                placeholder={msg}
                locale="en-GB"
                size="small"
                onChange={(date: string) => filterByKey('toDate', date)}
                value={filters.toDate}
              />
            )}
          </FormattedMessage>
        </div>
        <div className="ma2">
          <StatusDropDownMenu
            filterByKey={filterByKey}
            statusLabel={statusLabel}
          />
        </div>
        <div className="ma2">
          <Button size="small" type="submit">
            <FormattedMessage id="returns.filterResults" />
          </Button>
        </div>
        {isFiltered ? (
          <div className="ma2">
            <ButtonWithIcon
              variation="secondary"
              size="small"
              onClick={handleResetFilters}
            >
              <FormattedMessage id="returns.clearFilters" />
            </ButtonWithIcon>
          </div>
        ) : null}
      </div>
    </form>
  )
}

export default ReturnTableFrom
