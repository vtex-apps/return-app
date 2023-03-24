import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

import type {
  StatusUpdateMailData,
  ConfirmationMailData,
  Template,
} from '../typings/mailClient'

const MAIL_SERVICE_PATH = '/api/mail-service/pvt/sendmail'
const TEMPLATE_RENDER_PATH = '/api/template-render/pvt/templates'

export class MailClient extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        VtexIdClientAutCookie: context.authToken,
      },
    })
  }

  public sendMail(
    mailData: StatusUpdateMailData | ConfirmationMailData
  ): Promise<string> {
    return this.http.post(MAIL_SERVICE_PATH, mailData, {
      metric: 'mail-post-send',
    })
  }

  public getTemplate(name: string): Promise<Template> {
    return this.http.get(`${TEMPLATE_RENDER_PATH}/${name}`, {
      metric: 'mail-get-template',
    })
  }

  public publishTemplate(template: Template): Promise<any> {
    return this.http.post(TEMPLATE_RENDER_PATH, template, {
      headers: {
        ...this.options?.headers,
        VtexIdClientAutCookie: this.context.adminUserAuthToken ?? '',
      },
      metric: 'mail-post-template',
    })
  }
}
