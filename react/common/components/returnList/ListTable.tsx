import React, { useMemo } from 'react'
import { FormattedMessage } from 'react-intl'
import { Table, EmptyState } from 'vtex.styleguide'

import ReturnListSchema from './ListTableSchema'
import JumpToPage from './JumpToPage'
import ListTableFilter from './ListTableFilter'
import { useReturnRequestList } from '../../../hooks/useReturnRequestList'

const ListTable = () => {
  const {
    returnRequestData: { data, loading, error, refetch },
  } = useReturnRequestList()

  const { returnRequestList } = data ?? {}
  const { list, paging } = returnRequestList ?? {}

  let pageItemFrom = 0
  let pageItemTo = 0

  const hasPageAndItems = !!paging && !!list?.length

  if (hasPageAndItems) {
    const { currentPage, total, perPage, pages } = paging

    pageItemFrom = currentPage === 1 ? 1 : (currentPage - 1) * perPage + 1
    pageItemTo = currentPage === pages ? total : currentPage * perPage
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

  const handleJumpToPage = (desiredPage: number) => {
    desiredPage && refetch({ page: desiredPage })
  }

  const returnsListSchema = useMemo(() => ReturnListSchema(), [])

  if (error) {
    return (
      <EmptyState
        title={
          <FormattedMessage id="return-app.return-request-list.error.title" />
        }
      >
        <FormattedMessage id="return-app.return-request-list.error.description" />
      </EmptyState>
    )
  }

  return (
    <>
      <ListTableFilter
        refetch={refetch}
        loading={loading}
        isDisabled={!hasPageAndItems}
      />
      <Table
        fullWidth
        fixFirstColumn
        loading={loading}
        items={list}
        emptyStateLabel={
          <FormattedMessage id="return-app.return-request-list.table.emptyState" />
        }
        emptyStateChildren={
          <p>
            <FormattedMessage id="return-app.return-request-list.table.emptyState-children" />
          </p>
        }
        schema={returnsListSchema}
        pagination={{
          textOf: (
            <FormattedMessage id="return-app.return-request-list.table-pagination.textOf" />
          ),
          onNextClick: handleNextPage,
          onPrevClick: handlePrevPage,
          currentItemFrom: pageItemFrom,
          currentItemTo: pageItemTo,
          totalItems: paging?.total,
        }}
      />
      {hasPageAndItems ? (
        <JumpToPage
          handleJumpToPage={handleJumpToPage}
          currentPage={paging.currentPage}
          maxPage={paging.pages}
        />
      ) : null}
    </>
  )
}

export default ListTable
