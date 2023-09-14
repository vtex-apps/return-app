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
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

import { StatusActionMenu } from './StatusActionMenu'

const CSS_HANDLES = ['listTableFilterContainer'] as const

interface Props {
  refetch: (variables?: QueryReturnRequestListArgs | undefined) => Promise<
    ApolloQueryResult<{
      returnRequestList: ReturnRequestList
    }>
  >
  loading: boolean
  isDisabled: boolean
}

interface FilterDates {
  from: string
  to: string
}
interface Filters {
  status: Status | ''
  sequenceNumber: string
  id: string
  createdIn: FilterDates | undefined
  orderId: string
}

type Keys = keyof Filters | keyof FilterDates
export type FilterKeys = Exclude<Keys, 'createdIn'>

const initialFilters = {
  status: '',
  sequenceNumber: '',
  id: '',
  createdIn: undefined,
  orderId: '',
} as Filters

const ListTableFilter = (props: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  const { refetch, loading, isDisabled } = props

  const { route } = useRuntime()
  const [isFiltering, setIsFiltering] = useState(false)
  const [filters, setFilters] = useState(initialFilters)

  const { createdIn } = filters
  const fromDate = createdIn ? new Date(createdIn.from) : ''
  const toDate = createdIn ? new Date(createdIn.to) : ''

  // Used solely for refetch's variables
  const selectedFilters = Object.keys(filters)
    .filter((key) => filters[key])
    .reduce((newFilters, key) => {
      newFilters[key] = filters[key]

      return newFilters
    }, {})

  const hasSelectedFilters = Object.keys(selectedFilters).length > 0

  const handleSubmitFilters = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsFiltering(true)
    refetch({ filter: selectedFilters, page: 1 })
  }

  const handleResetFilters = () => {
    setIsFiltering(false)
    setFilters(initialFilters)
    refetch({ filter: undefined, page: 1 })
  }

  const handleOnChange = (key: FilterKeys, value: string) => {
    /* Both dates are non nullable */
    if (key === 'to' || key === 'from') {
      const filterDates = {
        ...filters.createdIn,
        [key]: value,
      } as FilterDates

      if (!filterDates.to) {
        filterDates.to = new Date().toISOString()
      }

      if (!filterDates.from) {
        filterDates.from = new Date(filterDates.to).toISOString()
      }

      setFilters({
        ...filters,
        createdIn: filterDates,
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
      <div className={`${handles.listTableFilterContainer} flex items-center`}>
        {route.domain === 'admin' ? (
          <div className="mr2">
            <FormattedMessage id="return-app.return-request-list.table-data.requestId">
              {(formattedMessage) => (
                <Input
                  placeholder={formattedMessage}
                  size="small"
                  value={filters.id}
                  onChange={(e: FormEvent<HTMLInputElement>) =>
                    handleOnChange('id', e.currentTarget.value)
                  }
                  readOnly={isDisabled && !isFiltering}
                />
              )}
            </FormattedMessage>
          </div>
        ) : null}
        <div className="mh2">
          <FormattedMessage id="return-app.return-request-list.table-data.sequenceNumber">
            {(formattedMessage) => (
              <Input
                placeholder={formattedMessage}
                size="small"
                value={filters.sequenceNumber}
                onChange={(e: FormEvent<HTMLInputElement>) =>
                  handleOnChange('sequenceNumber', e.currentTarget.value)
                }
                readOnly={isDisabled && !isFiltering}
              />
            )}
          </FormattedMessage>
        </div>
        <div className="mh2">
          <FormattedMessage id="return-app.return-request-list.table-data.orderId">
            {(formattedMessage) => (
              <Input
                placeholder={formattedMessage}
                size="small"
                value={filters.orderId}
                onChange={(e: FormEvent<HTMLInputElement>) =>
                  handleOnChange('orderId', e.currentTarget.value)
                }
                readOnly={isDisabled && !isFiltering}
              />
            )}
          </FormattedMessage>
        </div>
        <div className="mh2">
          <FormattedMessage id="return-app.return-request-list.table-filters.fromDate">
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
                disabled={isDisabled && !isFiltering}
              />
            )}
          </FormattedMessage>
        </div>
        <div className="mh2">
          <FormattedMessage id="return-app.return-request-list.table-filters.toDate">
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
                disabled={isDisabled && !isFiltering}
              />
            )}
          </FormattedMessage>
        </div>
        <div className="mh2">
          <StatusActionMenu
            handleOnChange={handleOnChange}
            status={filters.status}
            disabled={isDisabled && !isFiltering}
          />
        </div>
        <div className="mh2">
          <Button
            size="small"
            type="submit"
            disabled={!hasSelectedFilters || loading}
          >
            <FormattedMessage id="return-app.return-request-list.table-filters.apply-filters" />
          </Button>
        </div>
        <div className="mh2">
          <Button
            size="small"
            onClick={handleResetFilters}
            disabled={!isFiltering || loading}
            variation="danger"
          >
            <FormattedMessage id="return-app.return-request-list.table-filters.clear-filters" />
          </Button>
        </div>
      </div>
    </form>
  )
}

export default ListTableFilter
