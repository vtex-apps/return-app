import html from 'html-template-tag'

const HEAD_AND_STYLE = html`
  <head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>{{_accountInfo.TradingName}}</title>
    <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <style>
      .statusIcon {
        width: 30px;
        height: 30px;
        border: 1px solid #134cd8;
        border-radius: 50%;
        display: inline-block;
        box-sizing: border-box;
        padding-top: 3px;
        padding-left: 3px;
        background: #fff;
        margin-right: 20px;
      }

      .statusIconChecked {
        background: #134cd8;
      }

      .statusLine {
        display: flex;
        align-items: center;
      }

      .statusUl {
        background-image: linear-gradient(gray 33%, rgba(255, 255, 255, 0) 0%);
        background-position: left;
        background-size: 2px 6px;
        background-repeat: repeat-y;
        list-style-type: none;
        margin-left: 15px;
        min-height: 20px;
        padding-top: 0;
        padding-bottom: 0;
      }

      .statusUl li {
        padding-bottom: 5px;
      }

      .statusUlLast {
        background-image: none;
      }

      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
        font-size: inherit !important;
        font-family: inherit !important;
        font-weight: inherit !important;
        line-height: inherit !important;
      }
    </style>
    <style>
      @media (max-width: 600px) {
        img {
          max-width: 100% !important;
          height: auto !important;
        }
      }
    </style>
    <style>
      @media screen and (min-width: 30em) {
        .w-50-ns {
          width: 50% !important;
        }

        .pr4-ns {
          padding-right: 2rem !important;
        }

        .ph4-ns {
          padding-left: 2rem !important;
          padding-right: 2rem !important;
        }

        .mv1-ns {
          margin-top: 0.25rem !important;
          margin-bottom: 0.25rem !important;
        }

        .mv4-ns {
          margin-top: 2rem !important;
          margin-bottom: 2rem !important;
        }
      }
    </style>
  </head>
`

const HEADER = html`
  <tr style="box-sizing: border-box !important;">
    <td class="ph4-ns"
        style="font-size: 14px; line-height: 20px; box-sizing: border-box; border-collapse: collapse; border-bottom-style: solid; border-bottom-width: 1px; border-color: #eee; width: 100%; padding-bottom: 2rem; text-align: center !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
        align="center">
        <div style="box-sizing: border-box; width: 8rem; margin-bottom: 1rem; margin-top: 2rem; margin-right: auto; margin-left: auto !important;">
            <a href="http://{{_accountInfo.HostName}}.com.br"
                style="box-sizing: border-box !important;">
                <img alt="" border="0" width="auto"
                        src="http://licensemanager.vtex.com.br/api/site/pub/accounts/{{_accountInfo.Id}}/logos/show"
                        style="vertical-align: top; outline: none; text-decoration: none; -ms-interpolation-mode: bicubic; max-width: 100%; border: none; max-height: 80px !important;">
                </img>
            </a>
        </div>
        <h1 style="margin: 0; font-size: 25px; line-height: 35px; box-sizing: border-box !important;">
            {{#if data.status}}
            {{#compare data.status "==" 'new'}}
            New return request <br/>{{data.DocumentId}}
            {{else}}
            Return request <br/>{{data.DocumentId}}
            {{/compare}}
            {{/if}}
        </h1>
    </td>
  </tr>
`

const PRODUCTS = html`
  {{#compare products.length ">" 0}}

  <tr style="box-sizing: border-box !important;">
    <td
      class="ph4-ns"
      style="font-size: 14px; line-height: 20px; box-sizing: border-box; border-collapse: collapse; text-align: left; border-top-style: solid; border-top-width: 1px; border-bottom-style: solid; border-bottom-width: 1px; border-color: #eee; border-width: .5rem; width: 100%; padding-top: 2rem; padding-bottom: 2rem !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
      align="left"
    >
      <h3
        style="margin: 0; font-size: 20px; line-height: 36px; text-transform: uppercase; letter-spacing: 1.2pt; font-weight: 300; box-sizing: border-box; margin-top: 0 !important;"
      >
        Products
      </h3>

      <table style="border-collapse:collapse;font-size:14px;width: 36rem">
        <thead style="text-align:left">
          <tr>
            <th>Products</th>
            <th>Quantity</th>
            <th>Unit price</th>
          </tr>

          <tr></tr>
        </thead>

        <tbody>
          {{#each products}} {{#compare quantity '>' 0}}
          <tr>
            <td>{{name}}</td>
            <td>{{quantity}}</td>
            <td>{{formatCurrency sellingPrice}}</td>
          </tr>
          {{/compare}} {{/each}}
        </tbody>
      </table>
    </td>
  </tr>

  {{/compare}}
`

const CONTACT_DETAILS = html`
  <tr style="box-sizing: border-box !important;">
    <td
      class="ph4-ns"
      style="font-size: 14px; line-height: 20px; box-sizing: border-box; border-collapse: collapse; text-align: left; border-top-style: solid; border-top-width: 1px; border-bottom-style: solid; border-bottom-width: 1px; border-color: #eee; border-width: .5rem; width: 100%; padding-top: 2rem; padding-bottom: 2rem !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
      align="left"
    >
      <table style="border-collapse:collapse;font-size:14px;width: 36rem">
        <tr>
          <td>
            <h3
              style="margin: 0; font-size: 20px; line-height: 36px; text-transform: uppercase; letter-spacing: 1.2pt; font-weight: 300; box-sizing: border-box; margin-top: 0 !important;"
            >
              Contact Details
            </h3>
            <div>
              Name: {{data.name}}<br />
              E-mail: {{data.email}}<br />
              Phone: {{data.phoneNumber}}
            </div>
          </td>

          <td>
            <h3
              style="margin: 0; font-size: 20px; line-height: 36px; text-transform: uppercase; letter-spacing: 1.2pt; font-weight: 300; box-sizing: border-box; margin-top: 0 !important;"
            >
              Address
            </h3>
            <div>
              Country: {{data.country}}<br />
              Locality: {{data.locality}}<br />
              Address: {{data.address}}
            </div>
          </td>
        </tr>
      </table>
    </td>
  </tr>
`

const PAYMENT_METHOD = html`
  <tr style="box-sizing: border-box !important;">
    <td
      class="ph4-ns"
      style="font-size: 14px; line-height: 20px; box-sizing: border-box; border-collapse: collapse; text-align: left; border-top-style: solid; border-top-width: 1px; border-bottom-style: solid; border-bottom-width: 1px; border-color: #eee; border-width: .5rem; width: 100%; padding-top: 2rem; padding-bottom: 2rem !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
      align="left"
    >
      <h3
        style="margin: 0; font-size: 20px; line-height: 36px; text-transform: uppercase; letter-spacing: 1.2pt; font-weight: 300; box-sizing: border-box; margin-top: 0 !important;"
      >
        Refund payment method
      </h3>
      Method: {{#eq data.paymentMethod 'card'}} Credit or debit card used when
      placing the order {{/eq}} {{#eq data.paymentMethod 'bank'}} Bank
      transfer<br />
      IBAN: {{data.iban}} {{/eq}} {{#eq data.paymentMethod 'giftCard'}} Gift
      Card {{/eq}} {{#eq data.paymentMethod 'sameAsPurchase'}} Same as purchase
      {{/eq}}
    </td>
  </tr>
`

const STATUS_UPDATE = html`
  <tr style="box-sizing: border-box !important;">
    <td
      class="ph4-ns"
      style="font-size: 14px; line-height: 20px; box-sizing: border-box; border-collapse: collapse; text-align: left; border-top-style: solid; border-top-width: 1px; border-bottom-style: solid; border-bottom-width: 1px; border-color: #eee; border-width: .5rem; width: 100%; padding-top: 2rem; padding-bottom: 2rem !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
      align="left"
    >
      <h3
        style="margin: 0; font-size: 20px; line-height: 36px; text-transform: uppercase; letter-spacing: 1.2pt; font-weight: 300; box-sizing: border-box; margin-top: 0 !important;"
      >
        Return request status
      </h3>
      The current status for your return request is now: <br />
      <b>
        {{#eq data.status 'new'}} New {{/eq}} {{#eq data.status 'processing'}}
        Processing {{/eq}} {{#eq data.status 'pickedUpFromClient'}} Picked up
        from client {{/eq}} {{#eq data.status 'pendingVerification'}} Pending
        verification {{/eq}} {{#eq data.status 'packageVerified'}} Package
        verified {{/eq}} {{#eq data.status 'amountRefunded'}} Amount refunded
        {{/eq}} {{#eq data.status 'denied'}} Denied {{/eq}} {{#eq data.status
        'canceled'}} Canceled {{/eq}}
      </b>
    </td>
  </tr>
`

const REFUNDED_MESSAGE = html`
  {{#eq data.status 'refunded'}}
  <tr style="box-sizing: border-box !important;">
    <td
      class="ph4-ns"
      style="font-size: 14px; line-height: 20px; box-sizing: border-box; border-collapse: collapse; text-align: left; border-top-style: solid; border-top-width: 1px; border-bottom-style: solid; border-bottom-width: 1px; border-color: #eee; border-width: .5rem; width: 100%; padding-top: 2rem; padding-bottom: 2rem !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
      align="left"
    >
      <div>
        <h3
          style="margin: 0; font-size: 20px; line-height: 36px; text-transform: uppercase; letter-spacing: 1.2pt; font-weight: 300; box-sizing: border-box; margin-top: 0 !important;"
        >
          Refund details
        </h3>
        Refunded value {{#eq data.paymentMethod 'giftCard'}} in the form of a
        gift card worth {{formatCurrency data.refundedAmount}}$
        <br /><br />
        {{/eq}} {{#eq data.paymentMethod 'card'}} by bank card in the amount of
        {{formatCurrency data.refundedAmount}}$<br /><br />
        {{/eq}} {{#eq data.paymentMethod 'bank'}} by bank transfer in the amount
        of {{formatCurrency data.refundedAmount}}$<br />
        <b>IBAN: {{data.iban}}</b>
        {{/eq}}
      </div>
    </td>
  </tr>
  {{/eq}}
`

const DENIED_MESSSAGE = html`
  {{#eq data.status 'denied'}}

  <tr style="box-sizing: border-box !important;">
    <td
      class="ph4-ns"
      style="font-size: 14px; line-height: 20px; box-sizing: border-box; border-collapse: collapse; text-align: left; border-top-style: solid; border-top-width: 1px; border-bottom-style: solid; border-bottom-width: 1px; border-color: #eee; border-width: .5rem; width: 100%; padding-top: 2rem; padding-bottom: 2rem !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
      align="left"
    >
      <div>
        <h3
          style="margin: 0; font-size: 20px; line-height: 36px; text-transform: uppercase; letter-spacing: 1.2pt; font-weight: 300; box-sizing: border-box; margin-top: 0 !important;"
        >
          Final state
        </h3>
        <b>Return request rejected</b>
      </div>
    </td>
  </tr>
  {{/eq}}
`

const STATUS_TIMELINE = html`
{{#compare refundStatusData.length ">" 0}}

<tr style="box-sizing: border-box !important;">
    <td class="ph4-ns"
        style="font-size: 14px; line-height: 20px; box-sizing: border-box; border-collapse: collapse; text-align: left; border-top-style: solid; border-top-width: 1px; border-bottom-style: solid; border-bottom-width: 1px; border-color: #eee; border-width: .5rem; width: 100%; padding-top: 2rem; padding-bottom: 2rem !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
        align="left">
        <h3 style="margin: 0; font-size: 20px; line-height: 36px; text-transform: uppercase; letter-spacing: 1.2pt; font-weight: 300; box-sizing: border-box; margin-top: 0 !important;">
            Request status timeline</h3>
        <table style="border-collapse:collapse;font-size:14px;width: 36rem">
            <tr>
                <td>
                    <div>
                        {{#each refundStatusData}}
                        <div>
                            <p class="statusLine">
                                {{#unless @last}}

                                <span class="statusIcon statusIconChecked">
                                    <span style="color: #fff; display: block; width: 1.3rem; height: 1.3rem; text-align: center;"><b>✓</b></span>
                                </span>
                                <span>Status: 
                                  <b>
                                    {{#eq status 'new'}} New {{/eq}}
                                    {{#eq status 'processing'}} Processing {{/eq}}
                                    {{#eq status 'pickedUpFromClient'}} Picked up from client {{/eq}}
                                    {{#eq status 'pendingVerification'}} Pending verification {{/eq}}
                                    {{#eq status 'packageVerified'}} Package verified {{/eq}}
                                    {{#eq status 'amountRefunded'}} Amount refunded {{/eq}}
                                    {{#eq status 'denied'}} Denied {{/eq}} {{#eq status
                                      'canceled'}} Canceled {{/eq}}
                                  </b>
                                </span>
                                <ul class="statusUl">
                                  {{#each comments}} 
                                  {{#if visibleForCustomer}}
                                  <li>Comment: {{comment}}</li>
                                  {{/if}}
                                  {{/each}}
                                </ul>
                                
                                {{else}}
                                
                                <span class="statusIcon statusIconChecked">
                                    <span style="color: #fff; display: block; width: 1.3rem; height: 1.3rem; text-align: center;"><b>✓</b></span>
                                </span>
                                <span>Status: 
                                  <b>
                                    {{#eq status 'new'}} New {{/eq}}
                                    {{#eq status 'processing'}} Processing {{/eq}}
                                    {{#eq status 'pickedUpFromClient'}} Picked up from client {{/eq}}
                                    {{#eq status 'pendingVerification'}} Pending verification {{/eq}}
                                    {{#eq status 'packageVerified'}} Package verified {{/eq}}
                                    {{#eq status 'amountRefunded'}} Amount refunded {{/eq}}
                                    {{#eq status 'denied'}} Denied {{/eq}} {{#eq status
                                      'canceled'}} Canceled {{/eq}}
                                  </b>
                                </span>
                                <ul class="statusUl statusUlLast">
                                  {{#each comments}} 
                                  {{#if visibleForCustomer}}
                                  <li>Comment: {{comment}}</li>
                                  {{/if}}
                                  {{/each}}
                                </ul>

                                {{#compare status '!=' 'amountRefunded'}}
                                {{#compare status '!=' 'denied'}}
                                {{#compare status '!=' 'canceled'}}
                                <span class="statusIcon">
                                    <span style="color: #fff; display: block; width: 1.3rem; height: 1.3rem; text-align: center;"><b>✓</b></span>
                                </span>
                                <span>Status: 
                                  <b>
                                    {{#eq status 'new'}} Processing {{/eq}} 
                                    {{#eq status 'processing'}} Picked up from client {{/eq}}
                                    {{#eq status 'pickedUpFromClient'}} Pending verification {{/eq}}
                                    {{#eq status 'pendingVerification'}} Package verified {{/eq}}
                                    {{#eq status 'packageVerified'}} Amount refunded {{/eq}}
                                  </b>
                                </span>
                                {{/compare}}
                                {{/compare}}
                                {{/compare}}
                                {{/unless}}
                            </p>
                        </div>
                        {{/each}}
                    </div>
                </td>
            </tr>
        </table>

    </td>
</tr>
{{/compare}}
`

const createTemplate = (headAndStyle: string, ...bodyBlocks: string[]) => {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:v="urn:schemas-microsoft-com:vml"
      style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; box-sizing: border-box; width: 100%; height: 100%; margin: 0; padding: 0; background: #f1f1f1 !important;"
    >
      ${headAndStyle}
      <body
        style="-webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; box-sizing: border-box; width: 100%; height: 100%; margin: 0; padding: 0; background: #f1f1f1 !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
      >
        <table
          width="100%"
          border="0"
          cellpadding="0"
          cellspacing="0"
          style="box-sizing: border-box; margin: 0; padding: 0; background: #f1f1f1; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; width: 100%; height: 100%; line-height: 100% !important;"
        >
          <tr style="box-sizing: border-box !important;">
            <td
              align="left"
              valign="top"
              style="font-size: 14px; line-height: 20px; box-sizing: border-box; border-collapse: collapse; text-align: left !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
            >
              <table
                class="mv4-ns"
                width="100%"
                align="center"
                border="0"
                cellpadding="0"
                cellspacing="0"
                style="box-sizing: border-box; max-width: 40rem; width: 100%; background-color: #fff; border-collapse: collapse; border-spacing: 0; mso-table-lspace: 0pt; mso-table-rspace: 0pt !important; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;"
                bgcolor="#fff"
              >
                ${bodyBlocks.join('\n')}
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}

export const OMS_RETURN_REQUEST_CONFIRMATION_TEMPLATE_MESSAGE = createTemplate(
  HEAD_AND_STYLE,
  HEADER,
  PRODUCTS,
  CONTACT_DETAILS,
  PAYMENT_METHOD
)

export const OMS_RETURN_REQUEST_STATUS_UPDATE_TEMPLATE_MESSAGE = createTemplate(
  HEAD_AND_STYLE,
  HEADER,
  STATUS_UPDATE,
  REFUNDED_MESSAGE,
  DENIED_MESSSAGE,
  STATUS_TIMELINE
)
