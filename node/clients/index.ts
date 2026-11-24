import { IOClients } from '@vtex/api'
import { vbaseFor } from '@vtex/clients'
import { ReturnAppSettings } from 'vtex.return-app'

import { Catalog } from './catalog'
import { OMSCustom as OMS } from './oms'
import { GiftCard } from './giftCard'
import { MailClient } from './mail'
import Checkout from './checkout'
import { VtexId } from './vtexId'
import { CatalogGQL } from './catalogGQL'
import { VtexIdCredential } from './vtexIdCredential'
import { LicenseManager } from './licenseManager'
import { ReturnRequestClient } from './returnRequest'

const ReturnAppSettings = vbaseFor<string, ReturnAppSettings>('appSettings')

export class Clients extends IOClients {
  public get oms() {
    return this.getOrSet('oms', OMS)
  }

  public get appSettings() {
    return this.getOrSet('appSettings', ReturnAppSettings)
  }

  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get catalogGQL() {
    return this.getOrSet('catalogGQL', CatalogGQL)
  }

  public get returnRequest() {
    return this.getOrSet('returnRequest', ReturnRequestClient)
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

  public get vtexIdCredential() {
    return this.getOrSet('vtexIdCredential', VtexIdCredential)
  }

  public get licenseManagerClient() {
    return this.getOrSet('licenseManagerClient', LicenseManager)
  }
}
