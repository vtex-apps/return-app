import { IOClients } from '@vtex/api'

import ReturnApp from './returnapp'

// Extend the default IOClients implementation with our own custom clients.
export class Clients extends IOClients {
  public get returnApp() {
    return this.getOrSet('returnApp', ReturnApp)
  }
}
