/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import {
  Button,
  Checkbox,
  Input,
  RadioGroup,
  Dropdown,
  Textarea,
} from 'vtex.styleguide'
import PropTypes from 'prop-types'

import { returnFormDate } from '../common/utils'
import styles from '../styles.css'

interface FormInputs {
  name: string
  email: string
  phone: string
  country: string
  locality: string
  state: string
  address: string
  zip: string
  paymentMethod: string
  extraComment: string
  iban: string
  accountHolder: string
  agree: boolean
}

interface Props {
  showTable: any
  selectedOrder: any
  orderProducts: any
  handleQuantity: any
  handleReasonCode: any
  handleReason: any
  handleCondition: any
  errors: any
  handleInputChange: any
  formInputs: FormInputs
  submit: any
  settings: any
  intl: any
}

const messages = defineMessages({
  formCreditCard: { id: 'returns.formCreditCard' },
  formVoucher: { id: 'returns.formVoucher' },
  formBank: { id: 'returns.formBank' },
  formAgree: { id: 'returns.formAgree' },
  termsAndConditions: { id: 'returns.TermsConditions' },
  reasonAccidentalOrder: { id: 'returns.reasonAccidentalOrder' },
  reasonBetterPrice: { id: 'returns.reasonBetterPrice' },
  reasonPerformance: { id: 'returns.reasonPerformance' },
  reasonIncompatible: { id: 'returns.reasonIncompatible' },
  reasonItemDamaged: { id: 'returns.reasonItemDamaged' },
  reasonMissedDelivery: { id: 'returns.reasonMissedDelivery' },
  reasonMissingParts: { id: 'returns.reasonMissingParts' },
  reasonBoxDamaged: { id: 'returns.reasonBoxDamaged' },
  reasonDifferentProduct: { id: 'returns.reasonDifferentProduct' },
  reasonDefective: { id: 'returns.reasonDefective' },
  reasonArrivedInAddition: { id: 'returns.reasonArrivedInAddition' },
  reasonNoLongerNeeded: { id: 'returns.reasonNoLongerNeeded' },
  reasonUnauthorizedPurchase: {
    id: 'returns.reasonUnauthorizedPurchase',
  },
  reasonDifferentFromWebsite: {
    id: 'returns.reasonDifferentFromWebsite',
  },
  reasonOther: { id: 'returns.reasonOther' },
  formContactDetails: { id: 'returns.formContactDetails' },
  formName: { id: 'returns.formName' },
  formEmail: { id: 'returns.formEmail' },
  formPhone: { id: 'returns.formPhone' },
  formPickupAddress: { id: 'returns.formPickupAddress' },
  formParcel: { id: 'returns.formParcel' },
  formCountry: { id: 'returns.formCountry' },
  formLocality: { id: 'returns.formLocality' },
  formAddress: { id: 'returns.formAddress' },
  formState: { id: 'returns.formState' },
  formZip: { id: 'returns.formZip' },
  formPaymentMethod: { id: 'returns.formPaymentMethod' },
  formIBAN: { id: 'returns.formIBAN' },
  formAccountHolder: { id: 'returns.formAccountHolder' },
  formNextStep: { id: 'returns.formNextStep' },
  formErrorReasonMissing: { id: 'returns.formErrorReasonMissing' },
  formExtraComment: { id: 'returns.formExtraComment' },
  backToOrders: { id: 'returns.backToOrders' },
  orderDate: { id: 'returns.orderDate' },
  thOrderId: { id: 'returns.thOrderId' },
  thProduct: { id: 'returns.thProduct' },
  thQuantity: { id: 'returns.thQuantity' },
  thReason: { id: 'returns.thReason' },
  condition: { id: 'returns.condition.label' },
  formErrorConditionMissing: { id: 'returns.formErrorConditionMissing' },
  conditionNewWithBox: { id: 'returns.newWithBox' },
  conditionNewWithoutBox: { id: 'returns.newWithoutBox' },
  conditionUsedWithBox: { id: 'returns.usedWithBox' },
  conditionUsedWithoutBox: { id: 'returns.usedWithoutBox' },
})

class RequestForm extends Component<Props> {
  static propTypes = {
    data: PropTypes.object,
    intl: PropTypes.object,
  }

  componentDidMount(): void {
    typeof window !== 'undefined' && window.scrollTo(0, 0)
  }

  paymentMethods() {
    const {
      settings,
      intl: { formatMessage },
    }: any = this.props

    const output: any[] = []

    if (settings.paymentCard) {
      output.push({
        value: 'card',
        label: formatMessage({ id: messages.formCreditCard.id }),
      })
    }

    if (settings.paymentVoucher) {
      output.push({
        value: 'giftCard',
        label: formatMessage({ id: messages.formVoucher.id }),
      })
    }

    if (settings.paymentBank) {
      output.push({
        value: 'bank',
        label: formatMessage({ id: messages.formBank.id }),
      })
    }

    return output
  }

  renderTermsAndConditions = () => {
    const { settings }: any = this.props
    const { formatMessage } = this.props.intl

    return formatMessage(
      {
        id: messages.formAgree.id,
      },
      {
        link: (
          <span>
            {' '}
            <a
              rel="noopener noreferrer"
              target="_blank"
              href={settings.termsUrl}
            >
              {formatMessage({ id: messages.termsAndConditions.id })}
            </a>
          </span>
        ),
      }
    )
  }

  renderReasonsDropdown(product: any) {
    const {
      selectedOrder,
      settings: { options },
      intl: { formatMessage },
    }: any = this.props

    let returnOptions = [
      {
        value: 'reasonAccidentalOrder',
        label: formatMessage({ id: messages.reasonAccidentalOrder.id }),
      },
      {
        value: 'reasonBetterPrice',
        label: formatMessage({ id: messages.reasonBetterPrice.id }),
      },
      {
        value: 'reasonPerformance',
        label: formatMessage({ id: messages.reasonPerformance.id }),
      },
      {
        value: 'reasonIncompatible',
        label: formatMessage({ id: messages.reasonIncompatible.id }),
      },
      {
        value: 'reasonItemDamaged',
        label: formatMessage({ id: messages.reasonItemDamaged.id }),
      },
      {
        value: 'reasonMissedDelivery',
        label: formatMessage({ id: messages.reasonMissedDelivery.id }),
      },
      {
        value: 'reasonMissingParts',
        label: formatMessage({ id: messages.reasonMissingParts.id }),
      },
      {
        value: 'reasonBoxDamaged',
        label: formatMessage({ id: messages.reasonBoxDamaged.id }),
      },
      {
        value: 'reasonDifferentProduct',
        label: formatMessage({ id: messages.reasonDifferentProduct.id }),
      },
      {
        value: 'reasonDefective',
        label: formatMessage({ id: messages.reasonDefective.id }),
      },
      {
        value: 'reasonArrivedInAddition',
        label: formatMessage({ id: messages.reasonArrivedInAddition.id }),
      },
      {
        value: 'reasonNoLongerNeeded',
        label: formatMessage({ id: messages.reasonNoLongerNeeded.id }),
      },
      {
        value: 'reasonUnauthorizedPurchase',
        label: formatMessage({ id: messages.reasonUnauthorizedPurchase.id }),
      },
      {
        value: 'reasonDifferentFromWebsite',
        label: formatMessage({ id: messages.reasonDifferentFromWebsite.id }),
      },
      {
        value: 'reasonOther',
        label: formatMessage({ id: messages.reasonOther.id }),
      },
    ]

    if (options && options.length !== 0) {
      const orderDate = new Date(selectedOrder.creationDate).getTime()
      const today = new Date().getTime()
      const difference = ((today - orderDate) / (1000 * 60 * 60 * 24)).toFixed(
        0
      )

      returnOptions = options.reduce((filteredOptions: any, option: any) => {
        if (difference <= option.maxOptionDay) {
          const newOption = {
            value: option.optionName,
            label: option.optionName,
          }

          filteredOptions.push(newOption)
        }

        return filteredOptions
      }, [])

      returnOptions.push({
        value: 'reasonOther',
        label: formatMessage({ id: messages.reasonOther.id }),
      })
    }

    return (
      <div className={styles.reasonHolder}>
        <Dropdown
          label=""
          placeholder="Select Reason"
          size="small"
          options={returnOptions}
          value={product.reasonCode}
          errorMessage={
            product.reasonCode === '' && product.selectedQuantity > 0
              ? formatMessage({
                  id: messages.formErrorReasonMissing.id,
                })
              : ''
          }
          onChange={(e) => {
            this.props.handleReasonCode(product, e.target.value)
          }}
        />
        {product.reasonCode === 'reasonOther' ? (
          <div className={styles.mt10}>
            <Textarea
              resize="none"
              label=""
              value={product.reason}
              onChange={(e) => {
                this.props.handleReason(product, e.target.value)
              }}
              errorMessage={
                product.selectedQuantity > 0 &&
                product.reasonCode === 'reasonOther' &&
                (product.reason === '' ||
                  !product.reason.replace(/\s/g, '').length)
                  ? formatMessage({
                      id: messages.formErrorReasonMissing.id,
                    })
                  : ''
              }
            />
          </div>
        ) : null}
      </div>
    )
  }

  renderConditionDropdown(product: any) {
    const {
      intl: { formatMessage },
    }: any = this.props

    const conditionOptions = [
      {
        value: 'New With Box',
        label: formatMessage({ id: messages.conditionNewWithBox.id }),
      },
      {
        value: 'New Without Box',
        label: formatMessage({ id: messages.conditionNewWithoutBox.id }),
      },
      {
        value: 'Used With Box',
        label: formatMessage({ id: messages.conditionUsedWithBox.id }),
      },
      {
        value: 'Used Without Box',
        label: formatMessage({ id: messages.conditionUsedWithoutBox.id }),
      },
    ]

    return (
      <div className={styles.reasonHolder}>
        <Dropdown
          label=""
          placeholder="Select Condition"
          size="small"
          options={conditionOptions}
          value={product.condition}
          errorMessage={
            product.condition === '' && product.selectedQuantity > 0
              ? formatMessage({
                  id: messages.formErrorConditionMissing.id,
                })
              : ''
          }
          onChange={(e) => {
            this.props.handleCondition(product, e.target.value)
          }}
        />
      </div>
    )
  }

  render() {
    const {
      showTable,
      selectedOrder,
      orderProducts,
      handleQuantity,
      errors,
      handleInputChange,
      formInputs,
      submit,
      intl: { formatMessage },
    } = this.props

    return (
      <div>
        <div className={`mb6 mt4 ${styles.backToOrders}`}>
          <Button
            variation="secondary"
            size="small"
            onClick={() => showTable()}
          >
            {formatMessage({ id: messages.backToOrders.id })}
          </Button>
        </div>
        <div
          className={`cf w-100 pa5 ph7-ns bb b--muted-4 bg-muted-5 lh-copy o-100 ${styles.orderInfoHeader}`}
        >
          <div className={`flex flex-row ${styles.orderInfoHeaderRow}`}>
            <div
              className={`flex flex-column w-50 ${styles.orderInfoHeaderColumn}`}
            >
              <div
                className={`w-100 f7 f6-xl fw4 c-muted-1 ttu ${styles.orderInfoHeaderOrderDateLabel}`}
              >
                {formatMessage({ id: messages.orderDate.id })}
              </div>
              <div
                className={`db pv0 f6 fw5 c-on-base f5-l ${styles.orderInfoHeaderOrderDate}`}
              >
                {returnFormDate(selectedOrder.creationDate)}
              </div>
            </div>
            <div
              className={`flex flex-column w-50 ${styles.orderInfoHeaderColumn}`}
            >
              <div
                className={`w-100 f7 f6-xl fw4 c-muted-1 ttu ${styles.orderInfoHeaderOrderIdLabel}`}
              >
                {formatMessage({ id: messages.thOrderId.id })}
              </div>
              <div
                className={`db pv0 f6 fw5 c-on-base f5-l ${styles.orderInfoHeaderOrderId}`}
              >
                {selectedOrder.orderId}
              </div>
            </div>
          </div>
        </div>
        <div>
          <table className={styles.tblProducts}>
            <thead className={styles.tableThead}>
              <tr className={styles.tableTr}>
                <th className={styles.tableTh} />
                <th className={styles.tableTh}>
                  {formatMessage({ id: messages.thProduct.id })}
                </th>
                <th className={styles.tableTh}>
                  {formatMessage({ id: messages.thQuantity.id })}
                </th>
                <th className={styles.tableTh}>
                  {formatMessage({ id: messages.thReason.id })}
                </th>
                <th className={styles.tableTh}>
                  {formatMessage({ id: messages.condition.id })}
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableTbody}>
              {orderProducts.map((product: any) => (
                <tr
                  key={`product${product.uniqueId}`}
                  className={styles.tableTr}
                >
                  <td className={`${styles.tableTd} ${styles.tableTdImage}`}>
                    <img
                      className={styles.imageCol}
                      src={product.imageUrl}
                      alt={product.name}
                    />
                  </td>
                  <td className={`${styles.tableTd} ${styles.w350}`}>
                    <a
                      className={styles.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      href={product.detailUrl}
                    >
                      {product.name}
                    </a>
                  </td>
                  <td className={`${styles.tableTd} ${styles.tableTdQuantity}`}>
                    <Input
                      suffix={`/${product.quantity}`}
                      size="regular"
                      type="number"
                      value={product.selectedQuantity}
                      onChange={(e) => {
                        handleQuantity(product, e.target.value)
                      }}
                      max={product.quantity}
                      min={0}
                    />
                  </td>
                  <td className={`${styles.tableTd} ${styles.tableTdReason}`}>
                    {this.renderReasonsDropdown(product)}
                  </td>
                  <td className={`${styles.tableTd} ${styles.tableTdReason}`}>
                    {this.renderConditionDropdown(product)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {errors.productQuantities ? (
            <p className={styles.errorMessage}>
              {formatMessage({ id: errors.productQuantities })}
            </p>
          ) : null}
        </div>
        <div
          className={`flex-ns flex-wrap flex-row ${styles.returnFormInputs}`}
        >
          <div
            className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsColumn} ${styles.returnFormInputsColumnLeft}`}
          >
            <p className={`${styles.returnFormInputsHeader}`}>
              {formatMessage({ id: messages.formContactDetails.id })}
            </p>
            <div className={`mb4 ${styles.returnFormInput}`}>
              <Input
                name="name"
                placeholder={formatMessage({ id: messages.formName.id })}
                onChange={handleInputChange}
                value={formInputs.name}
                errorMessage={
                  errors.name ? formatMessage({ id: errors.name }) : ''
                }
              />
            </div>
            <div className={`mb4 ${styles.returnFormInput}`}>
              <Input
                disabled
                name="email"
                placeholder={formatMessage({
                  id: messages.formEmail.id,
                })}
                onChange={handleInputChange}
                value={formInputs.email}
                errorMessage={
                  errors.email ? formatMessage({ id: errors.email }) : ''
                }
              />
            </div>
            <div className={`mb4 ${styles.returnFormInput}`}>
              <Input
                name="phone"
                placeholder={formatMessage({ id: messages.formPhone.id })}
                onChange={handleInputChange}
                value={formInputs.phone}
                errorMessage={
                  errors.phone ? formatMessage({ id: errors.phone }) : ''
                }
              />
            </div>
          </div>

          <div
            className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsColumn} ${styles.returnFormInputsColumnRight}`}
          >
            <p className={`${styles.returnFormInputsHeader}`}>
              {formatMessage({ id: messages.formPickupAddress.id })}
            </p>
            <div className={`mb4 ${styles.returnFormInput}`}>
              <Input
                name="address"
                placeholder={formatMessage({ id: messages.formAddress.id })}
                onChange={handleInputChange}
                value={formInputs.address}
                errorMessage={
                  errors.address ? formatMessage({ id: errors.address }) : ''
                }
              />
            </div>
            <div className={`mb4 ${styles.returnFormInput}`}>
              <Input
                name="locality"
                placeholder={formatMessage({ id: messages.formLocality.id })}
                onChange={handleInputChange}
                value={formInputs.locality}
                errorMessage={
                  errors.locality ? formatMessage({ id: errors.locality }) : ''
                }
              />
            </div>
            <div className={`mb4 ${styles.returnFormInput}`}>
              <Input
                name="state"
                placeholder={formatMessage({ id: messages.formState.id })}
                onChange={handleInputChange}
                value={formInputs.state || ''}
                errorMessage={
                  errors.state ? formatMessage({ id: errors.state }) : ''
                }
              />
            </div>
            <div className={`mb4 ${styles.returnFormInput}`}>
              <Input
                name="zip"
                placeholder={formatMessage({ id: messages.formZip.id })}
                onChange={handleInputChange}
                value={formInputs.zip || ''}
                errorMessage={
                  errors.zip ? formatMessage({ id: errors.zip }) : ''
                }
              />
            </div>
            <div className={`mb4 ${styles.returnFormInput}`}>
              <Input
                name="country"
                placeholder={formatMessage({ id: messages.formCountry.id })}
                onChange={handleInputChange}
                value={formInputs.country}
                errorMessage={
                  errors.country ? formatMessage({ id: errors.country }) : ''
                }
              />
            </div>
          </div>
          <div className={`mt4 ph4 ${styles.returnFormExtraComment}`}>
            <p className={`${styles.returnFormExtraCommentHeader}`}>
              {formatMessage({ id: messages.formExtraComment.id })}
            </p>
            <div className={`${styles.returnFormExtraCommentInput}`}>
              <Textarea
                name="extraComment"
                resize="none"
                onChange={handleInputChange}
                maxLength="250"
                value={formInputs.extraComment}
              />
            </div>
          </div>
        </div>

        <div
          className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsPayment}`}
        >
          <p className={`${styles.returnFormInputsHeader}`}>
            {formatMessage({ id: messages.formPaymentMethod.id })}
          </p>
          <RadioGroup
            hideBorder
            name="paymentMethod"
            options={this.paymentMethods()}
            value={formInputs.paymentMethod}
            errorMessage={
              errors.paymentMethod
                ? formatMessage({ id: errors.paymentMethod })
                : ''
            }
            onChange={handleInputChange}
          />
          {formInputs.paymentMethod === 'bank' ? (
            <div>
              <div
                className={`flex-ns flex-wrap flex-auto flex-column mt4 ${styles.returnFormInputAccountHolder}`}
              >
                <Input
                  name="accountHolder"
                  placeholder={formatMessage({
                    id: messages.formAccountHolder.id,
                  })}
                  onChange={handleInputChange}
                  value={formInputs.accountHolder}
                  errorMessage={
                    errors.accountHolder
                      ? formatMessage({ id: errors.accountHolder })
                      : ''
                  }
                />
              </div>
              <div
                className={`flex-ns flex-wrap flex-auto flex-column mt4 ${styles.returnFormInputIban}`}
              >
                <Input
                  name="iban"
                  placeholder={formatMessage({ id: messages.formIBAN.id })}
                  onChange={handleInputChange}
                  value={formInputs.iban}
                  errorMessage={
                    errors.iban ? formatMessage({ id: errors.iban }) : ''
                  }
                />
              </div>
            </div>
          ) : null}
        </div>

        <div
          className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormTerms}`}
        >
          <Checkbox
            checked={formInputs.agree}
            id="agree"
            key="formAgreeCheckbox"
            label={this.renderTermsAndConditions()}
            name="agree"
            onChange={handleInputChange}
            value={formInputs.agree}
          />
          {errors.agree ? (
            <p
              className={`c-danger t-small mt3 lh-title ${styles.returnFormErrorAgree}`}
            >
              {formatMessage({ id: errors.agree })}
            </p>
          ) : null}
        </div>

        <div className={`mt4 ph4 ${styles.returnFormActions}`}>
          <Button type="submit" variation="primary" onClick={submit}>
            {formatMessage({ id: messages.formNextStep.id })}
          </Button>
        </div>
      </div>
    )
  }
}

export default injectIntl(RequestForm)
