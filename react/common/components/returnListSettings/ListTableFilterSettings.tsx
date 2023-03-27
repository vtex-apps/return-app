import type { FormEvent } from 'react'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { Input, Button } from 'vtex.styleguide'
import type {
  QueryReturnSettingsListArgs,
  ReturnSettingsList,
} from 'vtex.return-app'
import type { ApolloQueryResult } from 'apollo-client'
import { useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'

const CSS_HANDLES = ['listTableFilterContainer'] as const

interface Props {
  refetch: (variables?: QueryReturnSettingsListArgs | undefined) => Promise<
    ApolloQueryResult<{
      returnSettingsList: ReturnSettingsList
    }>
  >
  loading: boolean
  isDisabled: boolean
}

interface Filters {
  id: string
  sellerName: string
}

type Keys = keyof Filters
export type FilterKeys = Exclude<Keys, Filters>

const initialFilters = {
  id: '',
  sellerName: '',
} as Filters

const ListTableFilterSettings = (props: Props) => {
  const handles = useCssHandles(CSS_HANDLES)

  const { refetch, loading, isDisabled } = props

  const { route } = useRuntime()
  const [isFiltering, setIsFiltering] = useState(false)
  const [filters, setFilters] = useState(initialFilters)

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
            <FormattedMessage id="return-app.sellers-settings-list.table-data.settingId">
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
          <FormattedMessage id="return-app.return-request-list.table-data.sellerName">
            {(formattedMessage) => (
              <Input
                placeholder={formattedMessage}
                size="small"
                value={filters.sellerName}
                onChange={(e: FormEvent<HTMLInputElement>) =>
                  handleOnChange('sellerName', e.currentTarget.value)
                }
                readOnly={isDisabled && !isFiltering}
              />
            )}
          </FormattedMessage>
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

export default ListTableFilterSettings
