import React from 'react'
import { useQuery } from 'react-apollo'
import { useIntl, FormattedMessage } from 'react-intl'
import { AutocompleteInput, IconWarning } from 'vtex.styleguide'
import type { CategoryInfo } from 'vtex.return-app'

import GET_CATEGORY_TREE_INFO from '../graphql/getCategoryTreeName.gql'

interface FilterSearchCategoriesArgs {
  categoryList?: CategoryInfo[]
  term: string
}

const AUTO_COMPLETE_LIST_SIZE = 10

export const filterSearchCategories = ({
  categoryList,
  term,
}: FilterSearchCategoriesArgs): Array<{ label: string; value: string }> => {
  if (!categoryList) {
    return []
  }

  const formattedLabels = categoryList.map(({ id, name }) => {
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
  const intl = useIntl()
  const { data, loading, error } = useQuery<{
    categoryTreeName: CategoryInfo[]
  }>(GET_CATEGORY_TREE_INFO)

  const listOfOptions = filterSearchCategories({
    categoryList: data?.categoryTreeName,
    term: searchedCategory,
  })

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
            disabled: error,
          }}
          options={{
            onSelect: () => {},
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
    </div>
  )
}
