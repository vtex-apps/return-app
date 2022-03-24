import { IOClients } from '@vtex/api'
import { vbaseFor, OMS } from '@vtex/clients'
import { ReturnAppSettings } from 'vtex.return-app'

import ReturnApp from './returnapp'
import Masterdata from './masterdata'
import { MDFactory } from './mdFactory'

const ReturnAppSettings = vbaseFor<string, ReturnAppSettings>('appSettings')

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

  public get appSettings() {
    return this.getOrSet('appSettings', ReturnAppSettings)
  }
}
