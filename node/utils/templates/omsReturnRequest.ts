import {
  OMS_RETURN_REQUEST_CONFIRMATION,
  OMS_RETURN_REQUEST_CONFIRMATION_FRIENDLY_NAME,
} from '../constants'
import { OMS_RETURN_REQUEST_CONFIRMATION_TEMPLATE_MESSAGE } from './templateMessages'

export const OMS_RETURN_REQUEST_TEMPLATE: Template = {
  Name: OMS_RETURN_REQUEST_CONFIRMATION,
  FriendlyName: OMS_RETURN_REQUEST_CONFIRMATION_FRIENDLY_NAME,
  Description: '[OMS] Return requests status changes',
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
      Message: OMS_RETURN_REQUEST_CONFIRMATION_TEMPLATE_MESSAGE,
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
}
