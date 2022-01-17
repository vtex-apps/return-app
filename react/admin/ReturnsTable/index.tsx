/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import ReturnsTableContent from './ReturnsTableContent'
import {fetchHeaders, fetchMethod, fetchPath} from '../../common/fetch'
import {omsReturnRequest} from '../../common/templates/oms-return-request'
import {schemaNames} from '../../common/utils'
import {Spinner} from 'vtex.styleguide'

class ReturnsTable extends Component<any, any> {
    static propTypes = {
        navigate: PropTypes.func
    };
    constructor(props: any) {
        super(props)
        this.state = {
            error: '',
           loading: true
        }
    }

    async componentDidMount() {
        const getSettingsResponse = await fetch(`${fetchPath.getSchema}${schemaNames.settings}`, {
            method: fetchMethod.get,
            headers: fetchHeaders,
        });
        const text = await getSettingsResponse.text();

        if (text === '') {
          await fetch(fetchPath.renderTemplates, {
                method: fetchMethod.post,
                body: JSON.stringify({
                    Name: 'oms-return-request',
                    FriendlyName: '[OMS] Return Request',
                    Description: null,
                    IsDefaultTemplate: false,
                    AccountId: null,
                    AccountName: null,
                    ApplicationId: null,
                    IsPersisted: true,
                    IsRemoved: false,
                    Type: '',
                    Templates: {
                        email: {
                            To: '{{data.email}}',
                            CC: null,
                            BCC: '{{#compare data.status "==" \'New\'}}{{/compare}}',
                            Subject: 'Formular de returnare {{data.DocumentId}}',
                            Message: omsReturnRequest,
                            Type: 'E',
                            ProviderId: '00000000-0000-0000-0000-000000000000',
                            ProviderName: null,
                            IsActive: true,
                            withError: false,
                        },
                        sms: {
                            Type: 'S',
                            ProviderId: null,
                            ProviderName: null,
                            IsActive: false,
                            withError: false,
                            Parameters: [],
                        },
                    },
                }),
                headers: fetchHeaders,
            })

            await fetch(fetchPath.generateSchema, {
                method: fetchMethod.put,
                headers: fetchHeaders,
            });

        } else {
            const json = JSON.parse(text)
            if ('error' in json) {
                this.setState({error: json.error})
            }
        }

        this.setState({loading: false})
    }

    render() {
        const {error, loading} = this.state

        if (error) {
            return <div>{error}</div>
        }

        if(loading) {
          return <Spinner />;
        }

      return <ReturnsTableContent navigate={this.props.navigate}/>
    }
}

export default ReturnsTable
