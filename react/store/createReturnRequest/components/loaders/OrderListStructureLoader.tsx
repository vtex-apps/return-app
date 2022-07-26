import React from 'react'
import type { FunctionComponent } from 'react'
import { SkeletonPiece } from 'vtex.my-account-commons'

export const OrderListStructureLoader: FunctionComponent = () => {
  const rowsLength = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

  return (
    <table className="w-100">
      <thead className="w-100 ph4 truncate overflow-x-hidden c-muted-2 f6">
        <tr className="w-100 truncate overflow-x-hidden">
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
            <SkeletonPiece width="30" size="3" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
            <SkeletonPiece width="40" size="3" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
            <SkeletonPiece width="40" size="3" />
          </th>
          <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
            <SkeletonPiece width="30" size="3" />
          </th>
        </tr>
      </thead>
      <tbody className="v-mid">
        {rowsLength.map((num) => {
          return (
            <tr key={num}>
              <td className="pa3">
                <SkeletonPiece width="70" size="3" />
              </td>
              <td className="pa3">
                <SkeletonPiece width="40" size="3" />
              </td>
              <td className="pa3">
                <SkeletonPiece width="30" size="3" />
              </td>
              <td className="pa3">
                <SkeletonPiece width="50" size="3" />
              </td>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}
