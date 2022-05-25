import { IOClients } from '@vtex/api'
import { vbaseFor, masterDataFor } from '@vtex/clients'
import { ReturnAppSettings, ReturnRequest } from 'vtex.return-app'

import ReturnApp from './returnapp'
import Masterdata from './masterdata'
import { Catalog } from './catalog'
import { OMSCustom as OMS } from './oms'
import { GiftCard } from './giftCard'

const ReturnAppSettings = vbaseFor<string, ReturnAppSettings>('appSettings')
const ReturnRequest = masterDataFor<ReturnRequest>('returnRequest')

export class Clients extends IOClients {
  public get returnApp() {
    return this.getOrSet('returnApp', ReturnApp)
  }

  public get masterData() {
    return this.getOrSet('masterData', Masterdata)
  }

  public get oms() {
    return this.getOrSet('oms', OMS)
  }

  public get appSettings() {
    return this.getOrSet('appSettings', ReturnAppSettings)
  }

  public get catalog() {
    return this.getOrSet('catalog', Catalog)
  }

  public get returnRequest() {
    return this.getOrSet('returnRequest', ReturnRequest)
  }

  public get giftCard() {
    return this.getOrSet('giftCard', GiftCard)
  }
}
