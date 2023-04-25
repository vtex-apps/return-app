import React, { useRef, useState } from 'react'
import axios from 'axios'
import { FormattedMessage } from 'react-intl'
import { Input, DatePicker, Button, AutocompleteInput } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import type { FormEvent } from 'react'
import { useQuery } from 'react-apollo'
import type { ApolloQueryResult } from 'apollo-client'
import type {
  QueryReturnRequestListArgs,
  ReturnRequestList,
  Status,
} from '../../../../typings/ReturnRequest'

import { StatusActionMenu } from './StatusActionMenu'
import GET_SELLER from '../../graphql/getSeller.gql'

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
  sellerName: string
}

type Keys = keyof Filters | keyof FilterDates
export type FilterKeys = Exclude<Keys, 'createdIn'>

const initialFilters = {
  status: '',
  sequenceNumber: '',
  id: '',
  createdIn: undefined,
  orderId: '',
  sellerName: '',
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

  const downloadCSV = async () => {
    try {
      if ('createdIn' in selectedFilters) {
        const { createdIn } = selectedFilters
        const { from, to } = createdIn as FilterDates

        const response = await axios.get(
          `/_v/return-request/export`,
          {
            params: {
              _dateSubmitted: `${from},${to}`,
            },
          }
        )

        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')

        link.href = url
        link.setAttribute('download', `return-requests-${(new Date().toJSON().slice(0,10))}.csv`)
        document.body.appendChild(link)
        link.click()

        if (link.parentNode) {
          link.parentNode.removeChild(link)
        }
      }
    } catch (error) {
      console.error('Error al descargar el archivo CSV:', error)
    }
  }

  const UsersAutocomplete = ({ placeholder, readOnly }: any) => {
    const [term, setTerm] = useState('')
    const [isLoading, setLoading] = useState(false)
    const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const { data } = useQuery(GET_SELLER)

    const sellers = data?.sellers?.items.map((seller) => seller.name) || []

    const options = {
      onSelect: (...args) => handleOnChange('sellerName', args[0]),
      isLoading,
      size: 'small',
      value: term.length
        ? sellers.filter((seller: string) => {
            return seller.toLowerCase().includes(term.toLowerCase())
          })
        : [],
    }

    const input = {
      // eslint-disable-next-line @typescript-eslint/no-shadow
      onChange: (term) => {
        if (term) {
          setLoading(true)
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }

          timeoutRef.current = setTimeout(() => {
            setLoading(false)
            setTerm(term)
            timeoutRef.current = null
          }, 1000)
        } else {
          setTerm(term)
        }
      },
      onClear: () => handleOnChange('sellerName', ''),
      disabled: readOnly,
      placeholder,
      value: filters.sellerName,
    }

    return <AutocompleteInput input={input} options={options} />
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
          <FormattedMessage id="return-app.return-request-list.table-data.searchBySellerName">
            {(formattedMessage) => (
              <UsersAutocomplete
                placeholder={formattedMessage}
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
        <div className="mh2">
          <Button
            id="custom-excel-button"
            size="small"
            onClick={downloadCSV}
            disabled={!createdIn || loading}
            variation="primary"
          >
            <FormattedMessage id="return-app.return-request-list.table-filters.export-returns" />
          </Button>
        </div>
      </div>
    </form>
  )
}

export default ListTableFilter
