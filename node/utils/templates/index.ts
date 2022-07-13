import type { Template } from '../../typings/mailClient'
import {
  OMS_RETURN_REQUEST_CONFIRMATION,
  OMS_RETURN_REQUEST_CONFIRMATION_FRIENDLY_NAME,
  OMS_RETURN_REQUEST_STATUS_UPDATE,
  OMS_RETURN_REQUEST_STATUS_UPDATE_FRIENDLY_NAME,
} from '../constants'
import {
  OMS_RETURN_REQUEST_CONFIRMATION_TEMPLATE_MESSAGE,
  OMS_RETURN_REQUEST_STATUS_UPDATE_TEMPLATE_MESSAGE,
} from './templateMessages'

export const OMS_RETURN_REQUEST_CONFIRMATION_TEMPLATE = (
  locale = 'en-GB'
): Template => ({
  Name: OMS_RETURN_REQUEST_CONFIRMATION(locale),
  FriendlyName: OMS_RETURN_REQUEST_CONFIRMATION_FRIENDLY_NAME(locale),
  Description: '[OMS] Return requests confirmation message',
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
      BCC: '{{#compare data.status "==" \'new\'}}{{/compare}}',
      Subject: 'New Return request {{data.DocumentId}}',
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
})

export const OMS_RETURN_REQUEST_STATUS_UPDATE_TEMPLATE = (
  locale = 'en-GB'
): Template => ({
  Name: OMS_RETURN_REQUEST_STATUS_UPDATE(locale),
  FriendlyName: OMS_RETURN_REQUEST_STATUS_UPDATE_FRIENDLY_NAME(locale),
  Description: '[OMS] Return requests status update message',
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
      BCC: '{{#compare data.status "==" \'new\'}}{{/compare}}',
      Subject: 'Return request status update {{data.DocumentId}}',
      Message: OMS_RETURN_REQUEST_STATUS_UPDATE_TEMPLATE_MESSAGE,
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
})
