import { IOClients } from '@vtex/api'
import { OMS } from '@vtex/clients/build'

import ReturnApp from './returnapp'
import Masterdata from './masterdata'
import Checkout from './checkout'

// Extend the default IOClients implementation with our own custom clients.
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

  public get checkout() {
    return this.getOrSet('checkout', Checkout)
  }
}
