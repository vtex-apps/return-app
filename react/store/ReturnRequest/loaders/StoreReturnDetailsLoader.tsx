import type { FC } from 'react'
import React from 'react'
import type { ApolloError } from 'apollo-client'
import { Alert } from 'vtex.styleguide'
import { useIntl } from 'react-intl'
import { SkeletonPiece } from 'vtex.my-account-commons'

import { parseReturnRequestError } from '../../utils/parseReturnRequestError'

interface Props {
  data: {
    loading: boolean
    error?: ApolloError
  }
}

export const StoreReturnDetailsLoader: FC<Props> = ({ data, children }) => {
  const { loading, error } = data
  const { formatMessage } = useIntl()

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
          {/* Current Status */}
          <div className="mv4">
            <div className="mb4">
              <SkeletonPiece width="34" size="3" />
            </div>
            <div>
              <div>
                <SkeletonPiece width="20" size="3" />
              </div>
            </div>
          </div>
          {/* End of Current Status */}
          {/* Order Link */}
          <div>
            <SkeletonPiece width="25" size="3" />
          </div>
          {/* End of Order Link */}
          {/* Items List */}
          <section className="mt6">
            <table className="w-100 bb b--muted-4">
              <thead className="w-100 ph4 truncate overflow-x-hidden c-muted-2 f6">
                <tr className="w-100 truncate overflow-x-hidden">
                  <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s w3">
                    <SkeletonPiece width="80" size="2" />
                  </th>
                  <th
                    className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc"
                    style={{ width: '500px' }}
                  >
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
                    <SkeletonPiece width="80" size="5" />
                  </td>
                  <td>
                    <span className="mh2">
                      <SkeletonPiece width="70" size="3" />
                    </span>
                    <span className="mh2">
                      <SkeletonPiece width="70" size="3" />
                    </span>
                    <span className="mh2">
                      <SkeletonPiece width="70" size="3" />
                    </span>
                    <span className="mh2">
                      <SkeletonPiece width="70" size="3" />
                    </span>
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
          </section>
          {/* End of Items List */}
          {/* Order Return Values */}
          <section className="mv4">
            <div className="mb5 w-100">
              <h3>
                <SkeletonPiece width="40" size="3" />
              </h3>
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
          </section>
          {/* End of Return Value */}
          <div className="flex-ns flex-row">
            {/* Contact Details */}
            <section className="w-100">
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
            </section>
            {/* End of Contact Details */}
            {/* Pickup Address */}
            <section className="w-100">
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
                <div className="mb4">
                  <SkeletonPiece width="70" size="3" />
                </div>
              </div>
            </section>
            {/* End of Pickup Address */}
          </div>
          {/* Refund Method */}
          <section className="w-50">
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
          </section>
          {/* End of Refund Method */}
          {/* Status TimeLine */}
          <section className="w-50">
            <div className="flex-ns flex-wrap flex-auto flex-column pa4">
              <div className="mb6">
                <SkeletonPiece width="30" size="3" />
              </div>
              <div className="mb6">
                <SkeletonPiece width="70" size="5" />
              </div>
              <div className="mb6">
                <SkeletonPiece width="70" size="5" />
              </div>
              <div className="mb6">
                <SkeletonPiece width="70" size="5" />
              </div>
              <div className="mb6">
                <SkeletonPiece width="70" size="5" />
              </div>
              <div className="mb6">
                <SkeletonPiece width="70" size="5" />
              </div>
              <div className="mb6">
                <SkeletonPiece width="70" size="5" />
              </div>
            </div>
          </section>
          {/* End of Status TimeLine */}
          {/* Status History */}
          <section>
            <div className="flex-ns flex-wrap flex-auto flex-column pa4">
              <div className="mb6">
                <SkeletonPiece width="30" size="3" />
              </div>
              <table className="w-100 bb b--muted-4">
                <thead className="w-100 ph4 truncate overflow-x-hidden c-muted-2 f6">
                  <tr className="w-100 truncate overflow-x-hidden">
                    <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s">
                      <SkeletonPiece width="30" size="3" />
                    </th>
                    <th className="v-mid pv0 tl bb b--muted-4 normal bg-base bt ph3 z1 pv3-s tc">
                      <SkeletonPiece width="30" size="3" />
                    </th>
                  </tr>
                </thead>
                <tbody className="v-mid">
                  <tr>
                    <td>
                      <SkeletonPiece width="70" size="3" />
                    </td>
                    <td>
                      <SkeletonPiece width="70" size="3" />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          {/* End of Status History */}
        </>
      )}
    </>
  )
}
