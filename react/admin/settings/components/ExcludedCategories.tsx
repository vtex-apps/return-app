import React, { useMemo } from 'react'
import { useQuery } from 'react-apollo'
import { useIntl, FormattedMessage } from 'react-intl'
import { AutocompleteInput, IconWarning, IconDeny } from 'vtex.styleguide'

import type { CategoryInfo } from '../../../../typings/Category'
import GET_CATEGORY_TREE_INFO from '../graphql/getCategoryTreeName.gql'
import { useSettings } from '../hooks/useSettings'

interface FilterSearchCategoriesArgs {
  categoryList?: CategoryInfo[]
  term: string
  excludedCategories: string[]
}

interface LabelFormat {
  /**
   * The category name.
   */
  label: string
  /**
   * The category id.
   */
  value: string
}

const AUTO_COMPLETE_LIST_SIZE = 10

const filterSearchCategories = ({
  categoryList,
  term,
  excludedCategories,
}: FilterSearchCategoriesArgs): LabelFormat[] => {
  if (!categoryList) {
    return []
  }

  const removeExcluded = categoryList.filter(({ id }) => {
    if (!id) return false

    return !excludedCategories?.includes(id)
  })

  const formattedLabels = removeExcluded.map(({ id, name }) => {
    return {
      label: `${id} - ${name}`,
      value: id as string,
    }
  })

  return formattedLabels.filter(({ label }) =>
    label.toLowerCase().includes(term.toLowerCase())
  )
}

export const ExcludedCategories = () => {
  const [searchedCategory, setSearchedCategory] = React.useState('')
  const { appSettings, actions } = useSettings()

  const { dispatch } = actions || {}

  const { excludedCategories } = appSettings || {}

  const intl = useIntl()
  const { data, loading, error } = useQuery<{
    categoryTreeName: CategoryInfo[]
  }>(GET_CATEGORY_TREE_INFO)

  const categoryNamesMap = useMemo(() => {
    if (!data) {
      return {}
    }

    const { categoryTreeName } = data

    return categoryTreeName.reduce((categoryMap, { id, name }) => {
      if (id) {
        categoryMap[id] = name
      }

      return categoryMap
    }, {})
  }, [data])

  const listOfOptions = filterSearchCategories({
    categoryList: data?.categoryTreeName,
    term: searchedCategory,
    excludedCategories,
  })

  const handleCategorySelection = (e: LabelFormat) => {
    dispatch({
      type: 'updateExcludedCategories',
      payload: [...excludedCategories, e.value],
    })
    setSearchedCategory('')
  }

  const handleDeleteExcludedCategory = (categoryId: string) => {
    dispatch({
      type: 'updateExcludedCategories',
      payload: excludedCategories.filter((id) => id !== categoryId),
    })
  }

  return (
    <div className="flex flex-column mb6">
      <div className="flex flex-column w-100">
        <h3>
          <FormattedMessage id="admin/return-app.settings.excluded-categories.label" />
        </h3>
        <AutocompleteInput
          id="excluded-categories"
          input={{
            placeholder: intl.formatMessage({
              id: 'admin/return-app.settings.search-categories.placeholder',
            }),
            onChange: (term: string) => setSearchedCategory(term),
            onClear: () => setSearchedCategory(''),
            value: searchedCategory,
          }}
          options={{
            onSelect: handleCategorySelection,
            value: !searchedCategory.length
              ? []
              : listOfOptions.slice(0, AUTO_COMPLETE_LIST_SIZE),
            loading:
              loading ||
              (searchedCategory.length > 0 &&
                listOfOptions.length > AUTO_COMPLETE_LIST_SIZE),
            customMessage: !error ? null : (
              <div className="w-100 pa4 f6 br2 br--bottom bg-base flex items-center">
                <div className="ph3 c-danger flex">
                  <IconWarning />
                </div>
                <p className="c-danger">
                  <FormattedMessage id="admin/return-app.settings.section-excluded-categories.fetch-data-error" />
                </p>
              </div>
            ),
          }}
        />
      </div>

      {!excludedCategories?.length ? null : (
        <ul>
          {excludedCategories.map((categoryId) => {
            const categoryName = categoryNamesMap[categoryId]

            return (
              <li key={categoryId}>
                <span className="flex items-center">
                  <p>{`${categoryId} - ${categoryName}`}</p>
                  <button
                    className="pointer mh4 bg-transparent c-danger"
                    style={{
                      border: 'none',
                    }}
                    type="button"
                    onClick={() => handleDeleteExcludedCategory(categoryId)}
                  >
                    <IconDeny size={12} />
                  </button>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
