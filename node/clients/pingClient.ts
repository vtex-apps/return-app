import {CacheType, InstanceOptions, IOClient, IOContext} from '@vtex/api'

export default class PingClient extends IOClient {
  private readonly baseUrl: string
  constructor(ctx: IOContext, options?: InstanceOptions) {
    super(ctx, options)

    this.baseUrl = `http://${this.context.host}/returns`
  }

  public async ping() {
    return this.http.get(`${this.baseUrl}/ping`, {cacheable: CacheType.None}).catch(() => Promise.resolve())
  }

  public static getMiddleware = () => async function ping(ctx: Context, next: () => Promise<any>) {
    ctx.vtex.logger.info({
      middleware: 'PING',
      message: `Pinged`,
    })
    ctx.set('Cache-Control', 'no-store')
    ctx.status = 200
    await next()
  }
}