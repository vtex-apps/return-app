/* eslint-disable no-console */
import type { FormEvent } from 'react'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Input, DatePicker, Button } from 'vtex.styleguide'
import type {
  QueryReturnRequestListArgs,
  ReturnRequestList,
  Status,
} from 'vtex.return-app'
import type { ApolloQueryResult } from 'apollo-client'

import { StatusActionMenu } from './StatusActionMenu'

interface Props {
  refetch: (variables?: QueryReturnRequestListArgs | undefined) => Promise<
    ApolloQueryResult<{
      returnRequestList: ReturnRequestList
    }>
  >
  loading: boolean
}

interface CreatedDates {
  from: string
  to: string
}
interface Filters {
  status: Status | ''
  sequenceNumber: string
  id: string
  createdIn: CreatedDates | undefined
  orderId: string
}

type Keys = keyof Filters | keyof CreatedDates
export type FilterKeys = Exclude<Keys, 'createdIn'>

const initialFilters = {
  status: '',
  sequenceNumber: '',
  id: '',
  createdIn: undefined,
  orderId: '',
} as Filters

/**
 * @todo
 * - Resolve messages
 */
const ListTableFilter = (props: Props) => {
  const { refetch, loading } = props

  const [isFiltering, setIsFiltering] = useState(false)
  const [filters, setFilters] = useState(initialFilters)

  const fromDate = filters.createdIn ? new Date(filters.createdIn.from) : ''
  const toDate = filters.createdIn ? new Date(filters.createdIn.to) : ''

  const selectedFilters = Object.keys(filters)
    .filter((key) => filters[key])
    .reduce((newFilters, key) => {
      newFilters[key] = filters[key]

      return newFilters
    }, {})

  const handleSubmitFilters = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    !isFiltering && setIsFiltering(true)
    refetch({ filter: selectedFilters, page: 1 })
  }

  const handleResetFilters = () => {
    isFiltering && setIsFiltering(false)
    setFilters(initialFilters)
    refetch({ filter: {}, page: 1 })
  }

  const handleOnChange = (key: FilterKeys, value: string) => {
    /* Both dates are non nullable */
    if (key === 'to' || key === 'from') {
      const dates = { ...filters.createdIn, [key]: value } as CreatedDates

      if (!dates.to) {
        dates.to = new Date().toISOString()
      }

      if (!dates.from) {
        dates.from = new Date(dates.to).toISOString()
      }

      setFilters({
        ...filters,
        createdIn: dates,
      })

      return
    }

    setFilters({
      ...filters,
      [key]: value,
    })
  }

  return (
    <form onSubmit={handleSubmitFilters}>
      <div className="flex items-center">
        <div className="mr2">
          <FormattedMessage id="returns.requestId">
            {(formattedMessage) => (
              <Input
                placeholder={formattedMessage}
                size="small"
                value={filters.id}
                onChange={(e: FormEvent<HTMLInputElement>) =>
                  handleOnChange('id', e.currentTarget.value)
                }
              />
            )}
          </FormattedMessage>
        </div>
        <div className="mh2">
          <FormattedMessage id="returns.sequenceNumber">
            {(formattedMessage) => (
              <Input
                placeholder={formattedMessage}
                size="small"
                value={filters.sequenceNumber}
                onChange={(e: FormEvent<HTMLInputElement>) =>
                  handleOnChange('sequenceNumber', e.currentTarget.value)
                }
              />
            )}
          </FormattedMessage>
        </div>
        <div className="mh2">
          <FormattedMessage id="returns.orderId">
            {(formattedMessage) => (
              <Input
                placeholder={formattedMessage}
                size="small"
                value={filters.orderId}
                onChange={(e: FormEvent<HTMLInputElement>) =>
                  handleOnChange('orderId', e.currentTarget.value)
                }
              />
            )}
          </FormattedMessage>
        </div>
        <div className="mh2">
          <FormattedMessage id="returns.filterFromDate">
            {(formattedMessage) => (
              <DatePicker
                maxDate={new Date()}
                placeholder={formattedMessage}
                locale="en-GB"
                size="small"
                onChange={(date: Date) =>
                  handleOnChange('from', new Date(date).toISOString())
                }
                value={fromDate}
              />
            )}
          </FormattedMessage>
        </div>
        <div className="mh2">
          <FormattedMessage id="returns.filterToDate">
            {(formattedMessage) => (
              <DatePicker
                maxDate={new Date()}
                placeholder={formattedMessage}
                locale="en-GB"
                size="small"
                onChange={(date: Date) =>
                  handleOnChange('to', new Date(date).toISOString())
                }
                value={toDate}
              />
            )}
          </FormattedMessage>
        </div>
        <div className="mh2">
          <StatusActionMenu
            handleOnChange={handleOnChange}
            status={filters.status}
          />
        </div>
        <div className="mh2">
          <Button
            size="small"
            type="submit"
            disabled={Object.keys(selectedFilters).length === 0}
            isLoading={loading}
          >
            <FormattedMessage id="returns.filterResults" />
          </Button>
        </div>
        <div className="mh2">
          <Button
            size="small"
            onClick={handleResetFilters}
            disabled={!isFiltering}
            variation="danger"
            isLoading={loading}
          >
            <FormattedMessage id="returns.clearFilters" />
          </Button>
        </div>
      </div>
    </form>
  )
}

export default ListTableFilter
