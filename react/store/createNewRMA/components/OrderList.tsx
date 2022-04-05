import React from 'react'
import { Link } from 'vtex.render-runtime'
import type { OrdersToReturnList } from 'vtex.return-app'

import { SelectOrderTable } from './SelectOrderTable'

interface Props {
  orders: OrdersToReturnList
}

export const OrderList = ({ orders }: Props) => {
  // eslint-disable-next-line no-console
  console.log({ orders })

  return (
    <>
      <div>Orders</div>
      <SelectOrderTable />
      <Link to="#/my-returns/add/1234">Add</Link>
    </>
  )
}
