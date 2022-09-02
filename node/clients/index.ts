import { IOClients, Sphinx } from '@vtex/api'
import { vbaseFor, masterDataFor } from '@vtex/clients'
import { ReturnAppSettings, ReturnRequest } from 'vtex.return-app'
import type { ExportReportData } from 'vtex.return-app'

import { Catalog } from './catalog'
import { OMSCustom as OMS } from './oms'
import { GiftCard } from './giftCard'
import { MailClient } from './mail'
import Checkout from './checkout'
import { VtexId } from './vtexId'
import { CatalogGQL } from './catalogGQL'
import { ReturnRequestReport } from './report'

type ExportReportDataVBase = Pick<
  ExportReportData,
  'id' | 'selectedFilters' | 'requestedBy'
>

const ReturnAppSettings = vbaseFor<string, ReturnAppSettings>('appSettings')
const ExportReport = vbaseFor<string, ExportReportDataVBase>('exportReport')
const ReturnRequest = masterDataFor<ReturnRequest>('returnRequest')

export class Clients extends IOClients {
  public get oms() {
    return this.getOrSet('oms', OMS)
  }

  public get appSettings() {
    return this.getOrSet('appSettings', ReturnAppSettings)
  }

  public get exportReport() {
    return this.getOrSet('exportReport', ExportReport)
  }

  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get catalogGQL() {
    return this.getOrSet('catalogGQL', CatalogGQL)
  }

  public get returnRequest() {
    return this.getOrSet('returnRequest', ReturnRequest)
  }

  public get report() {
    return this.getOrSet('report', ReturnRequestReport)
  }

  public get giftCard() {
    return this.getOrSet('giftCard', GiftCard)
  }

  public get mail() {
    return this.getOrSet('mail', MailClient)
  }

  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }

  public get vtexId() {
    return this.getOrSet('vtexId', VtexId)
  }

  public get sphinx() {
    return this.getOrSet('sphinx', Sphinx)
  }
}
