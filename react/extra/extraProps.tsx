import React, {useEffect, useState} from 'react'
import {BaseLoading, SkeletonBox} from 'vtex.my-account-commons'
import {useLazyQuery} from 'react-apollo'

import GET_REFUNDS_LIST from '../graphql/userRefunds.graphql'
import {Profile} from '../typings/utils'
import {fetchPath} from "../common/fetch";

import { injectIntl} from "react-intl";

export {React}

const headerConfig = {
    titleId: 'store/my-returns.link',
}

const withExtraProps = (WrappedComponent: any): any => ({...props}) => {
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
        variables: {userId: profile.UserId || '-1'},
    })

    useEffect(() => {
        fetch(fetchPath.getProfile)
            .then(response => response.json())
            .then(async response => {
                if (response.IsUserDefined) {
                    setProfile(response)
                }
            })
    }, [])

    useEffect(() => {
        if (profile.IsUserDefined) {
            getReturnsList()
        }
    }, [profile])

    useEffect(() => {
        if (returnsListQuery.called && !returnsListQuery.loading && returnsListQuery.data?.length != 0) {
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
                <SkeletonBox shouldAllowGrowing/>
            </BaseLoading>
        )
    }

    return (
        <WrappedComponent {...props} profile={profile} companyList={returnsList}/>
    )
}

export default injectIntl(withExtraProps)
