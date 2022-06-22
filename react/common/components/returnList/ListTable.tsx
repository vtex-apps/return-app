import React from 'react'
import { FormattedMessage } from 'react-intl'
import { Table } from 'vtex.styleguide'
import { useRuntime } from 'vtex.render-runtime'
import type {
  Maybe,
  Pagination,
  QueryReturnRequestListArgs,
  ReturnRequestList,
  ReturnRequestResponse,
} from 'vtex.return-app'
import type { ApolloQueryResult } from 'apollo-client'

import ReturnListSchema from './ListTableSchema'

interface Props {
  paging: Maybe<Pagination> | undefined
  refetch: (variables?: QueryReturnRequestListArgs | undefined) => Promise<
    ApolloQueryResult<{
      returnRequestList: ReturnRequestList
    }>
  >
  loading: boolean
  list: Maybe<ReturnRequestResponse[]> | undefined
}

const ListTable = (props: Props) => {
  const { paging, refetch, list, loading } = props

  const { navigate } = useRuntime()

  let itemFrom = 0
  let itemTo = 0

  if (paging && list?.length) {
    const { currentPage, total, perPage, pages } = paging

    itemFrom = currentPage === 1 ? 1 : (currentPage - 1) * perPage + 1
    itemTo = currentPage === pages ? total : currentPage * perPage
  }

  const handleNextPage = () => {
    if (!paging) return

    const { currentPage, pages } = paging

    if (currentPage === pages) return

    refetch({ page: currentPage + 1 })
  }

  const handlePrevPage = () => {
    if (!paging) return

    const { currentPage } = paging

    if (currentPage === 1) return

    refetch({ page: currentPage - 1 })
  }

  const handleRowClick = ({ id }) => {
    navigate({
      to: `/admin/app/returns/${id}/details`,
    })
  }

  return (
    <Table
      fullWidth
      fixFirstColumn
      loading={loading}
      items={list}
      emptyStateLabel="No records to show"
      schema={ReturnListSchema()}
      onRowClick={({ rowData }) => {
        handleRowClick(rowData)
      }}
      pagination={{
        textOf: <FormattedMessage id="returns.tableOf" />,
        onNextClick: handleNextPage,
        onPrevClick: handlePrevPage,
        currentItemFrom: itemFrom,
        currentItemTo: itemTo,
        totalItems: paging?.total,
      }}
    />
  )
}

export default ListTable
