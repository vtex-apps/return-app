import type { Template } from '../../typings/mailClient'
import { templateFriendlyName, templateName } from '../emailTemplates'
import {
  OMS_RETURN_REQUEST_CONFIRMATION_TEMPLATE_MESSAGE,
  OMS_RETURN_REQUEST_LABEL_TEMPLATE_MESSAGE,
  OMS_RETURN_REQUEST_STATUS_UPDATE_TEMPLATE_MESSAGE,
} from './templateMessages'

export const OMS_RETURN_REQUEST_CONFIRMATION_TEMPLATE = (
  locale = 'en-GB'
): Template => ({
  Name: templateName('confirmation', locale),
  FriendlyName: templateFriendlyName('Confirmation', locale),
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
  Name: templateName('status-update', locale),
  FriendlyName: templateFriendlyName('Status Update', locale),
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

export const OMS_RETURN_REQUEST_LABEL_TEMPLATE = (
  locale = 'en-GB'
): Template => ({
  Name: templateName('label', locale),
  FriendlyName: templateFriendlyName('Label', locale),
  Description: '[OMS] Return requests shipping label message',
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
      Subject: 'Return request shipping label {{data.DocumentId}}',
      Message: OMS_RETURN_REQUEST_LABEL_TEMPLATE_MESSAGE,
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
