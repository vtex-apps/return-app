import React from 'react'
import { Layout, PageHeader, PageBlock, EmptyState } from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'

import { useReturnRequestList } from '../../hooks/useReturnRequestList'
import ListTableFilter from '../../common/components/returnList/ListTableFilter'
import ListTable from '../../common/components/returnList/ListTable'

/**
 * @returns Admin layout implementing the return list
 */
export const AdminReturnList = () => {
  const {
    returnRequestData: { data, loading, error, refetch },
  } = useReturnRequestList()

  const { returnRequestList } = data ?? {}
  const { list, paging } = returnRequestList ?? {}

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
          <>
            <ListTableFilter refetch={refetch} loading={loading} />
            <ListTable
              paging={paging}
              refetch={refetch}
              loading={loading}
              list={list}
            />
          </>
        )}
      </PageBlock>
    </Layout>
  )
}
