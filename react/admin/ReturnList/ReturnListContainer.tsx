import React from 'react'
import {
  Layout,
  PageHeader,
  PageBlock,
  Table,
  EmptyState,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import { useReturnRequestList } from '../../hooks/useReturnRequestList'
import ReturnListSchema from '../../common/components/returnList/ListTableSchema'

/* 
TODO:
Check messages
typear param renderIcon
*/

export const AdminReturnList = () => {
  const { navigate } = useRuntime()
  const {
    returnRequestData: { data, loading, error, refetch },
  } = useReturnRequestList()

  const { returnRequestList } = data ?? {}
  const { list, paging } = returnRequestList ?? {}

  let itemFrom = 1
  let itemTo = 25

  if (paging) {
    const { currentPage, total, perPage, pages } = paging

    itemFrom = currentPage === 1 ? 1 : (currentPage - 1) * perPage
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
    <Layout
      fullWidth
      pageHeader={
        <PageHeader
          title={
            <FormattedMessage id="admin/return-app.return-request-list.page-header.title" />
          }
          subtitle="All return requests created by the store users. Click on a row to see more."
        />
      }
    >
      <PageBlock variation="full" fit="fill">
        {error ? (
          <EmptyState
            title={
              <FormattedMessage id="admin/return-app.return-request-list.error.title" />
            }
          >
            <FormattedMessage id="admin/return-app.return-request-list.error.description" />
          </EmptyState>
        ) : (
          <div>
            <Table
              fullWidth
              fixFirstColumn
              loading={loading}
              items={list}
              emptyStateLabel={<FormattedMessage id="returns.tableShowRows" />}
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
          </div>
        )}
      </PageBlock>
    </Layout>
  )
}
