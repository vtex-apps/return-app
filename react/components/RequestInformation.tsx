import React, { Component } from 'react'
import styles from '../styles.css'
import { injectIntl, defineMessages } from 'react-intl'
import { Button } from 'vtex.styleguide'

interface Props {
  orderProducts: any
  showForm: any
  sendRequest: any
  errorSubmit: string
  info: any
  intl: any
}

const messages = defineMessages({
  thProduct: { id: 'returns.thProduct' },
  thQuantity: { id: 'returns.thQuantity' },
  thReason: { id: 'returns.thReason' },
  formContactDetails: { id: 'returns.formContactDetails' },
  formName: { id: 'returns.formName' },
  formEmail: { id: 'returns.formEmail' },
  formPhone: { id: 'returns.formPhone' },
  formPickupAddress: { id: 'returns.formPickupAddress' },
  formCountry: { id: 'returns.formCountry' },
  formLocality: { id: 'returns.formLocality' },
  formAddress: { id: 'returns.formAddress' },
  formState: { id: 'returns.formState' },
  formZip: { id: 'returns.formZip' },
  formHeight: { id: 'returns.formHeight' },
  formWidth: { id: 'returns.formWidth' },
  formLength: { id: 'returns.formLength' },
  formWeight: { id: 'returns.formWeight' },
  formParcel: { id: 'returns.formParcel' },
  formPaymentMethod: { id: 'returns.formPaymentMethod' },
  formBankTransferAccount: { id: 'returns.formBankTransferAccount' },
  formVoucher: { id: 'returns.formVoucher' },
  formSubmit: { id: 'returns.formSubmit' },
  goBack: { id: 'returns.goBack' },
})

class RequestInformation extends Component<Props> {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      orderProducts,
      info,
      showForm,
      sendRequest,
      errorSubmit,
      intl: { formatMessage },
    } = this.props

    return (
      <div>
        <div>
          <table className={`${styles.table} ${styles.tableInformation}`}>
            <thead className={`${styles.tableThead}`}>
              <tr className={`${styles.tableTr}`}>
                <th className={`${styles.tableTh}`} />
                <th className={`${styles.tableTh}`}>
                  {formatMessage({ id: messages.thProduct.id })}
                </th>
                <th className={`${styles.tableTh}`}>
                  {formatMessage({ id: messages.thQuantity.id })}
                </th>
              </tr>
            </thead>
            <tbody className={`${styles.tableTbody}`}>
              {orderProducts.map((product: any) =>
                parseInt(product.selectedQuantity) > 0 ? (
                  <tr
                    key={`product` + product.uniqueId}
                    className={`${styles.tableTr}`}
                  >
                    <td className={`${styles.tableTd} ${styles.tableTdImage}`}>
                      <img
                        className={`${styles.requestInformationImage}`}
                        src={product.imageUrl}
                        alt={product.name}
                      />
                    </td>
                    <td className={`${styles.tableTd}`}>
                      {product.name}
                      <div className={`${styles.reasonStyle} ${styles.mt10}`}>
                        <span className={styles.strongText}>
                          {formatMessage({ id: messages.thReason.id })}
                          {': '}
                        </span>
                        {formatMessage({
                          id: `returns.${product.reasonCode}`,
                        })}

                        {product.reasonCode === 'reasonOther'
                          ? '( ' + product.reason + ' )'
                          : null}
                      </div>
                    </td>
                    <td className={`${styles.tableTd}`}>
                      {product.selectedQuantity} / {product.quantity}
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
          <div
            className={`flex-ns flex-wrap flex-row ${styles.returnFormInputs}`}
          >
            <div
              className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsColumn} ${styles.returnFormInputsColumnLeft}`}
            >
              <p className={`${styles.returnFormInputsHeader}`}>
                {formatMessage({ id: messages.formContactDetails.id })}
              </p>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  {formatMessage({ id: messages.formName.id })}: {info.name}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  {formatMessage({ id: messages.formEmail.id })}: {info.email}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  {formatMessage({ id: messages.formPhone.id })}: {info.phone}
                </p>
              </div>
            </div>

            <div
              className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsColumn} ${styles.returnFormInputsColumnRight}`}
            >
              <p className={`${styles.returnFormInputsHeader}`}>
                {formatMessage({ id: messages.formPickupAddress.id })}
              </p>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  {formatMessage({ id: messages.formCountry.id })}:{' '}
                  {info.country}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  {formatMessage({ id: messages.formLocality.id })}:{' '}
                  {info.locality}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  {formatMessage({ id: messages.formAddress.id })}:{' '}
                  {info.address}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  {formatMessage({ id: messages.formState.id })}: {info.state}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  {formatMessage({ id: messages.formZip.id })}: {info.zip}
                </p>
              </div>
            </div>

            <div
              className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsColumn} ${styles.returnFormInputsColumnRight}`}
            >
              <p className={`${styles.returnFormInputsHeader}`}>
                {formatMessage({ id: messages.formParcel.id })}
              </p>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  {formatMessage({ id: messages.formWeight.id })}: {info.weight}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  {formatMessage({ id: messages.formLength.id })}: {info.length}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  {formatMessage({ id: messages.formWidth.id })}: {info.width}
                </p>
              </div>
              <div className={`mb2 ${styles.requestInformationField}`}>
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationText}`}
                >
                  {formatMessage({ id: messages.formHeight.id })}: {info.height}
                </p>
              </div>
            </div>
          </div>
          <div
            className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsPayment}`}
          >
            <p className={`${styles.returnFormInputsHeader}`}>
              {formatMessage({ id: messages.formPaymentMethod.id })}
            </p>
            {info.paymentMethod === 'bank' ? (
              <div
                className={`flex-ns flex-wrap flex-auto flex-column mt4 ${styles.returnFormInputIban}`}
              >
                <p
                  className={`ma1 t-small c-on-base ${styles.requestInformationSelectedPayment}`}
                >
                  {formatMessage({ id: messages.formBankTransferAccount.id })}{' '}
                  {info.iban}
                </p>
              </div>
            ) : info.paymentMethod === 'giftCard' ? (
              <p
                className={`ma1 t-small c-on-base ${styles.requestInformationSelectedPayment}`}
              >
                {formatMessage({ id: messages.formVoucher.id })}
              </p>
            ) : (
              <p
                className={`ma1 t-small c-on-base ${styles.requestInformationSelectedPayment}`}
              >
                {info.paymentMethod}
              </p>
            )}
          </div>
          <div
            className={`flex-ns flex-wrap flex-auto flex-row justify-between ${styles.tableAddColButton} ${styles.returnFormInfoActions}`}
          >
            <div
              className={`${styles.requestInformationActionColumn} ${styles.requestInformationActionBack}`}
            >
              <Button
                type={'submit'}
                onClick={() => {
                  showForm()
                }}
              >
                {formatMessage({ id: messages.goBack.id })}
              </Button>
            </div>
            <div
              className={`${styles.requestInformationActionColumn} ${styles.requestInformationActionSubmit}`}
            >
              <Button
                type={'submit'}
                variation="primary"
                onClick={() => {
                  sendRequest()
                }}
              >
                {formatMessage({ id: messages.formSubmit.id })}
              </Button>
            </div>
          </div>
          {errorSubmit ? (
            <div>
              <p className={styles.errorMessage}>{errorSubmit}</p>
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

export default injectIntl(RequestInformation)
