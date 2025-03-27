import React from 'react'
import type { FC } from 'react'
import { useIntl } from 'react-intl'
import { SkeletonPiece } from 'vtex.my-account-commons'
import { Alert } from 'vtex.styleguide'
import type { ApolloError } from 'apollo-client'

import { parseReturnRequestError } from '../../../utils/parseReturnRequestError'

interface Props {
  data: {
    loading: boolean
    error?: ApolloError
  }
}

export const OrderDetailsLoader: FC<Props> = ({ data, children }) => {
  const { formatMessage } = useIntl()
  const { loading, error } = data

  return (
    <>
      {!loading && !error ? (
        children
      ) : error ? (
        <Alert type="error">
          {formatMessage(parseReturnRequestError(error))}
        </Alert>
      ) : (
        <>
          <div className="mb5 w-100">
            <div className="w-100 flex flex-row-ns ba br3 b--muted-4 flex-column">
              <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns">
                <div>
                  <div className="c-muted-2 f6">
                    <SkeletonPiece width="40" size="3" />
                  </div>
                  <div className="w-100 mt2">
                    <div className="f4 fw5 c-on-base">
                      <SkeletonPiece width="70" size="3" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns">
                <div>
                  <div className="c-muted-2 f6">
                    <SkeletonPiece width="40" size="3" />
                  </div>
                  <div className="w-100 mt2">
                    <div className="f4 fw5 c-on-base">
                      <SkeletonPiece width="70" size="3" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* OrderId and creationDate end */}
          <table className="w-100">
            <thead className="w-100 ph4 truncate overflow-x-hidden c-muted-2 f6">
              <tr className="w-100 truncate overflow-x-hidden">
                <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
                  <SkeletonPiece width="30" size="2" />
                </th>
                <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
                  <SkeletonPiece width="30" size="2" />
                </th>
                <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
                  <SkeletonPiece width="30" size="2" />
                </th>
                <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
                  <SkeletonPiece width="30" size="2" />
                </th>
                <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
                  <SkeletonPiece width="30" size="2" />
                </th>
                <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
                  <SkeletonPiece width="30" size="2" />
                </th>
              </tr>
            </thead>
            <tbody className="v-mid">
              <tr>
                <td>
                  <section className="ml3">
                    <p className="t-body fw5 m2">
                      <SkeletonPiece width="30" size="2" />
                    </p>
                    <div className="flex">
                      <SkeletonPiece width="10" size="5" />
                    </div>
                  </section>
                </td>
                <td>
                  <SkeletonPiece width="70" size="3" />
                </td>
                <td>
                  <SkeletonPiece width="70" size="3" />
                </td>
                <td>
                  <SkeletonPiece width="70" size="3" />
                </td>
                <td>
                  <SkeletonPiece width="70" size="3" />
                </td>
                <td>
                  <SkeletonPiece width="70" size="3" />
                </td>
              </tr>
            </tbody>
          </table>
          {/* TableEnd */}
          <div className="flex-ns flex-wrap flex-row mt5">
            {/* contactDetails */}
            <div className="flex-ns flex-wrap flex-auto flex-column pa4">
              <p>
                <SkeletonPiece width="30" size="3" />
              </p>
              <div className="mb4">
                <SkeletonPiece width="70" size="3" />
              </div>
              <div className="mb4">
                <SkeletonPiece width="70" size="3" />
              </div>
              <div className="mb4">
                <SkeletonPiece width="70" size="3" />
              </div>
            </div>
            {/* AddressDetails */}
            <div className="flex-ns flex-wrap flex-auto flex-column pa4">
              <p>
                <SkeletonPiece width="30" size="3" />
              </p>
              <div className="mb4">
                <SkeletonPiece width="70" size="3" />
              </div>
              <div className="mb4">
                <SkeletonPiece width="70" size="3" />
              </div>
              <div className="mb4">
                <SkeletonPiece width="70" size="3" />
              </div>
              <div className="mb4">
                <SkeletonPiece width="70" size="3" />
              </div>
              <div className="mb4">
                <SkeletonPiece width="70" size="3" />
              </div>
            </div>
            {/* UserCommentDetails */}
            <div className="mt4 ph4">
              <p>
                <SkeletonPiece width="30" size="3" />
              </p>
              <div>
                <SkeletonPiece width="50" size="8" />
              </div>
            </div>
          </div>
          <div className="flex-ns flex-wrap flex-auto flex-column pa4 mb6">
            <p>
              <SkeletonPiece width="70" size="3" />
            </p>
            <p>
              <SkeletonPiece width="70" size="3" />
            </p>
          </div>
          <div className="flex-ns flex-wrap flex-auto flex-column pa4">
            <SkeletonPiece width="70" size="3" />
          </div>
          <div className="flex-ns flex-wrap flex-auto flex-column pa4">
            <SkeletonPiece width="20" size="4" />
          </div>
        </>
      )}
    </>
  )
}
