import React from 'react'
import { Link } from 'vtex.render-runtime'
import { Button } from 'vtex.styleguide'

import { useReturnRequestList } from '../../hooks/useReturnRequestList'

export const ReturnRequestList = () => {
  const { returnRequestData } = useReturnRequestList()
  const { data, loading, error } = returnRequestData
  const { returnRequestList } = data ?? {}
  const { list, paging } = returnRequestList ?? {}

  // eslint-disable-next-line no-console
  console.log({ error })

  return loading ? null : (
    <div>
      <p>Total Return {paging?.total}</p>
      <div>
        <Button variation="primary" size="small" href="#/my-returns/add">
          Add new
        </Button>
      </div>
      {list?.map((returnRequest) => (
        <div key={returnRequest.id}>
          <p>Id: {returnRequest.id}</p>
          <p>Status: {returnRequest.status}</p>
          <p>Created at: {returnRequest.createdIn}</p>
          <Link href={`#/my-returns/details/${returnRequest.id}`}>
            See details
          </Link>
        </div>
      ))}
    </div>
  )
}
