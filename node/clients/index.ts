import { IOClients, Sphinx } from '@vtex/api'
import { OMS } from '@vtex/clients/build'

import ReturnApp from './returnapp'
import Masterdata from './masterdata'
import { MDFactory } from './mdFactory'
import { VtexId } from './vtexId'

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

  // started migrating calls to MD via this class, that extends the
  // MasterData from @vtex/api. It will work as a factory, in order to make
  // it easy to call the methods from the resolvers.
  public get mdFactory() {
    return this.getOrSet('mdFactory', MDFactory)
  }

  public get vtexId() {
    return this.getOrSet('vtexId', VtexId)
  }

  public get sphinx() {
    return this.getOrSet('sphinx', Sphinx)
  }
}
