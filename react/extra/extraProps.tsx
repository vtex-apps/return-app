import React, { useEffect, useState } from 'react'
import { BaseLoading, SkeletonBox } from 'vtex.my-account-commons'
import { useLazyQuery } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

import GET_REFUNDS_LIST from '../graphql/userRefunds.graphql'
import type { Profile } from '../typings/utils'
import { fetchPath } from '../common/fetch'

export { React }

const headerConfig = {
  titleId: 'store/my-returns.link',
}

const withExtraProps =
  (WrappedComponent: any): any =>
  ({ ...props }) => {
    const [returnsList, setReturnsList] = useState<string[]>([])

    const [profile, setProfile] = useState<Profile>({
      Email: '',
      FirstName: '',
      Gender: '',
      IsReturningUser: false,
      IsUserDefined: false,
      LastName: '',
      UserId: '',
    })

    const [getReturnsList, returnsListQuery] = useLazyQuery(GET_REFUNDS_LIST, {
      variables: { userId: profile.UserId || '-1' },
    })

    const { rootPath } = useRuntime()

    useEffect(() => {
      const getProfileUrl = fetchPath.getProfile(rootPath)

      fetch(getProfileUrl)
        .then((response) => response.json())
        .then(async (response) => {
          if (response.IsUserDefined) {
            setProfile(response)
          }
        })
    }, [])

    useEffect(() => {
      if (profile.IsUserDefined) {
        getReturnsList()
      }
    }, [getReturnsList, profile])

    useEffect(() => {
      if (
        returnsListQuery.called &&
        !returnsListQuery.loading &&
        returnsListQuery.data
      ) {
        setReturnsList(returnsListQuery.data)
      }
    }, [returnsListQuery])

    if (
      !returnsListQuery.called ||
      returnsListQuery.loading ||
      returnsListQuery.error ||
      !returnsListQuery.data.length
    ) {
      return (
        <BaseLoading queryData={returnsListQuery} headerConfig={headerConfig}>
          <SkeletonBox shouldAllowGrowing />
        </BaseLoading>
      )
    }

    return (
      <WrappedComponent
        {...props}
        profile={profile}
        companyList={returnsList}
      />
    )
  }

export default injectIntl(withExtraProps)
