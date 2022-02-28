/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { useState, useEffect } from 'react'
import { useQuery } from 'react-apollo'
import { defineMessages, useIntl } from 'react-intl'
import {
  Button,
  Checkbox,
  Input,
  RadioGroup,
  Dropdown,
  Textarea,
  Toggle,
  Spinner,
} from 'vtex.styleguide'

import NEAR_PICKUP_POINTS from '../graphql/nearestPickupPoints.gql'
import { returnFormDate } from '../common/utils'
import styles from '../styles.css'

// interface FormInputs {
//   name: string
//   email: string
//   phone: string
//   country: string
//   locality: string
//   state: string
//   address: string
//   zip: string
//   paymentMethod: string
//   extraComment: string
//   iban: string
//   accountHolder: string
//   agree: boolean
// }

// interface Props {
//   showTable: any
//   selectedOrder: any
//   orderProducts: any
//   handleQuantity: any
//   handleReasonCode: any
//   handleReason: any
//   handleCondition: any
//   errors: any
//   handleInputChange: any
//   handleInputChangeByPickupPointsDropdown: any
//   formInputs: FormInputs
//   submit: any
//   settings: any
//   intl: any
//   NearestPickupPoints: any
// }

// interface State {
//   isPickupPointsSelected: boolean
//   selectedPickupPoint: string
//   dropdownOptionsPickupPoints: []
// }

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
  defaultPaymentMethod: { id: 'returns.defaultPaymentMethod' },
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

const RequestForm = (props) => {
  const lat =
    props.selectedOrder.shippingData.address.geoCoordinates[0].toString()

  const long =
    props.selectedOrder.shippingData.address.geoCoordinates[1].toString()

  const [isPickupPointsSelected, setIsPickupPointsSelected] = useState(false)
  const [selectedPickupPoint, setSelectedPickupPoint] = useState('')
  const [dropdownOptionsPickupPoints, setDropdownOptionsPickupPoints] =
    useState([])

  const { data } = useQuery(NEAR_PICKUP_POINTS, {
    variables: { lat, long },
  })

  const intl = useIntl()

  useEffect(() => {
    typeof window !== 'undefined' && window.scrollTo(0, 0)

    if (data) {
      const dropdownOptions = data.nearestPickupPoints.items.map(
        ({ pickupPoint }) => {
          const { friendlyName, address } = pickupPoint
          const { street, number, postalCode } = address

          return {
            value: friendlyName,
            label: `${friendlyName} - ${street} - ${number} - ${postalCode}`,
          }
        }
      )

      setDropdownOptionsPickupPoints(dropdownOptions)
    }
  }, [data])

  const handleChangeInputsbySelectedPickupPoint = (pickupPointInfo) => {
    const findSelectedPickupPoint = data.nearestPickupPoints.items.find(
      ({ pickupPoint }) => {
        return pickupPoint.friendlyName === pickupPointInfo
      }
    )

    props.handleInputChangeByPickupPointsDropdown(findSelectedPickupPoint)
  }

  const handlePickupPointSelected = (e) => {
    setSelectedPickupPoint(e.currentTarget.value)
    // handle on parent component
    handleChangeInputsbySelectedPickupPoint(e.currentTarget.value)
  }

  const paymentMethods = () => {
    const { settings, selectedOrder }: any = props

    const output: any[] = []

    if (
      settings.paymentCard &&
      selectedOrder.paymentData.transactions[0].payments[0].firstDigits !== null
    ) {
      output.push({
        value: 'card',
        label: intl.formatMessage({ id: messages.formCreditCard.id }),
      })
    }

    if (settings.paymentVoucher) {
      output.push({
        value: 'giftCard',
        label: intl.formatMessage({ id: messages.formVoucher.id }),
      })
    }

    if (settings.paymentBank) {
      output.push({
        value: 'bank',
        label: intl.formatMessage({ id: messages.formBank.id }),
      })
    }

    return output
  }

  const renderTermsAndConditions = () => {
    const { settings }: any = props

    return intl.formatMessage(
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
              {intl.formatMessage({ id: messages.termsAndConditions.id })}
            </a>
          </span>
        ),
      }
    )
  }

  const renderReasonsDropdown = (product: any) => {
    const {
      selectedOrder,
      settings: { options },
    }: any = props

    let returnOptions = [
      {
        value: 'reasonAccidentalOrder',
        label: intl.formatMessage({ id: messages.reasonAccidentalOrder.id }),
      },
      {
        value: 'reasonBetterPrice',
        label: intl.formatMessage({ id: messages.reasonBetterPrice.id }),
      },
      {
        value: 'reasonPerformance',
        label: intl.formatMessage({ id: messages.reasonPerformance.id }),
      },
      {
        value: 'reasonIncompatible',
        label: intl.formatMessage({ id: messages.reasonIncompatible.id }),
      },
      {
        value: 'reasonItemDamaged',
        label: intl.formatMessage({ id: messages.reasonItemDamaged.id }),
      },
      {
        value: 'reasonMissedDelivery',
        label: intl.formatMessage({ id: messages.reasonMissedDelivery.id }),
      },
      {
        value: 'reasonMissingParts',
        label: intl.formatMessage({ id: messages.reasonMissingParts.id }),
      },
      {
        value: 'reasonBoxDamaged',
        label: intl.formatMessage({ id: messages.reasonBoxDamaged.id }),
      },
      {
        value: 'reasonDifferentProduct',
        label: intl.formatMessage({ id: messages.reasonDifferentProduct.id }),
      },
      {
        value: 'reasonDefective',
        label: intl.formatMessage({ id: messages.reasonDefective.id }),
      },
      {
        value: 'reasonArrivedInAddition',
        label: intl.formatMessage({ id: messages.reasonArrivedInAddition.id }),
      },
      {
        value: 'reasonNoLongerNeeded',
        label: intl.formatMessage({ id: messages.reasonNoLongerNeeded.id }),
      },
      {
        value: 'reasonUnauthorizedPurchase',
        label: intl.formatMessage({
          id: messages.reasonUnauthorizedPurchase.id,
        }),
      },
      {
        value: 'reasonDifferentFromWebsite',
        label: intl.formatMessage({
          id: messages.reasonDifferentFromWebsite.id,
        }),
      },
      {
        value: 'reasonOther',
        label: intl.formatMessage({ id: messages.reasonOther.id }),
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

      /**
       * Note: here push other value, that we get from the backend as a settings props from the parent component.
       * settings.enableOtherOption
       */
      if (props.settings?.enableOtherOption) {
        returnOptions.push({
          value: 'reasonOther',
          label: intl.formatMessage({ id: messages.reasonOther.id }),
        })
      }
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
              ? intl.formatMessage({
                  id: messages.formErrorReasonMissing.id,
                })
              : ''
          }
          onChange={(e) => {
            props.handleReasonCode(product, e.target.value)
          }}
        />
        {product.reasonCode === 'reasonOther' ? (
          <div className={styles.mt10}>
            <Textarea
              resize="none"
              label=""
              value={product.reason}
              onChange={(e) => {
                props.handleReason(product, e.target.value)
              }}
              errorMessage={
                product.selectedQuantity > 0 &&
                product.reasonCode === 'reasonOther' &&
                (product.reason === '' ||
                  !product.reason.replace(/\s/g, '').length)
                  ? intl.formatMessage({
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

  const renderConditionDropdown = (product: any) => {
    const conditionOptions = [
      {
        value: 'New With Box',
        label: intl.formatMessage({ id: messages.conditionNewWithBox.id }),
      },
      {
        value: 'New Without Box',
        label: intl.formatMessage({ id: messages.conditionNewWithoutBox.id }),
      },
      {
        value: 'Used With Box',
        label: intl.formatMessage({ id: messages.conditionUsedWithBox.id }),
      },
      {
        value: 'Used Without Box',
        label: intl.formatMessage({ id: messages.conditionUsedWithoutBox.id }),
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
              ? intl.formatMessage({
                  id: messages.formErrorConditionMissing.id,
                })
              : ''
          }
          onChange={(e) => {
            props.handleCondition(product, e.target.value)
          }}
        />
      </div>
    )
  }

  return (
    <div>
      <div className={`mb6 mt4 ${styles.backToOrders}`}>
        <Button
          variation="secondary"
          size="small"
          onClick={() => props.showTable()}
        >
          {intl.formatMessage({ id: messages.backToOrders.id })}
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
              {intl.formatMessage({ id: messages.orderDate.id })}
            </div>
            <div>
              <table className={styles.tblProducts}>
                <thead className={styles.tableThead}>
                  <tr className={styles.tableTr}>
                    <th className={styles.tableTh} />
                    <th className={styles.tableTh}>
                      {intl.formatMessage({ id: messages.thProduct.id })}
                    </th>
                    <th className={styles.tableTh}>
                      {intl.formatMessage({ id: messages.thQuantity.id })}
                    </th>
                    <th className={styles.tableTh}>
                      {intl.formatMessage({ id: messages.thReason.id })}
                    </th>
                    <th className={styles.tableTh}>
                      {intl.formatMessage({ id: messages.condition.id })}
                    </th>
                  </tr>
                </thead>
                {!props.orderProducts.length ? (
                  <Spinner />
                ) : (
                  <tbody className={styles.tableTbody}>
                    {props.orderProducts.map((product: any) => (
                      <tr
                        key={`product${product.uniqueId}`}
                        className={styles.tableTr}
                      >
                        <td
                          className={`${styles.tableTd} ${styles.tableTdImage}`}
                        >
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
                        <td
                          className={`${styles.tableTd} ${styles.tableTdQuantity}`}
                        >
                          <Input
                            suffix={`/${product.quantity}`}
                            size="regular"
                            type="number"
                            value={product.selectedQuantity}
                            onChange={(e) => {
                              props.handleQuantity(product, e.target.value)
                            }}
                            max={product.quantity}
                            min={0}
                          />
                        </td>
                        <td
                          className={`${styles.tableTd} ${styles.tableTdReason}`}
                        >
                          {() => renderReasonsDropdown(product)}
                        </td>
                        <td
                          className={`${styles.tableTd} ${styles.tableTdReason}`}
                        >
                          {() => renderConditionDropdown(product)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
              {props.errors.productQuantities ? (
                <p className={styles.errorMessage}>
                  {intl.formatMessage({ id: props.errors.productQuantities })}
                </p>
              ) : null}
            </div>
            <div
              className={`db pv0 f6 fw5 c-on-base f5-l ${styles.orderInfoHeaderOrderDate}`}
            >
              {returnFormDate(props.selectedOrder.creationDate)}
            </div>
          </div>
          <div
            className={`flex flex-column w-50 ${styles.orderInfoHeaderColumn}`}
          >
            <div
              className={`w-100 f7 f6-xl fw4 c-muted-1 ttu ${styles.orderInfoHeaderOrderIdLabel}`}
            >
              {intl.formatMessage({ id: messages.thOrderId.id })}
            </div>
            <div
              className={`db pv0 f6 fw5 c-on-base f5-l ${styles.orderInfoHeaderOrderId}`}
            >
              {props.selectedOrder.orderId}
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
                {intl.formatMessage({ id: messages.thProduct.id })}
              </th>
              <th className={styles.tableTh}>
                {intl.formatMessage({ id: messages.thQuantity.id })}
              </th>
              <th className={styles.tableTh}>
                {intl.formatMessage({ id: messages.thReason.id })}
              </th>
              <th className={styles.tableTh}>
                {intl.formatMessage({ id: messages.condition.id })}
              </th>
            </tr>
          </thead>
          <tbody className={styles.tableTbody}>
            {props.orderProducts.map((product: any) => (
              <tr key={`product${product.uniqueId}`} className={styles.tableTr}>
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
                      props.handleQuantity(product, e.target.value)
                    }}
                    max={product.quantity}
                    min={0}
                  />
                </td>
                <td className={`${styles.tableTd} ${styles.tableTdReason}`}>
                  {renderReasonsDropdown(product)}
                </td>
                <td className={`${styles.tableTd} ${styles.tableTdReason}`}>
                  {renderConditionDropdown(product)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {props.errors.productQuantities ? (
          <p className={styles.errorMessage}>
            {intl.formatMessage({ id: props.errors.productQuantities })}
          </p>
        ) : null}
      </div>
      <div className={`flex-ns flex-wrap flex-row ${styles.returnFormInputs}`}>
        <div
          className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsColumn} ${styles.returnFormInputsColumnLeft}`}
        >
          <p className={`${styles.returnFormInputsHeader}`}>
            {intl.formatMessage({ id: messages.formContactDetails.id })}
          </p>
          <div className={`mb4 ${styles.returnFormInput}`}>
            <Input
              name="name"
              placeholder={intl.formatMessage({ id: messages.formName.id })}
              onChange={props.handleInputChange}
              value={props.formInputs.name}
              errorMessage={
                props.errors.name
                  ? intl.formatMessage({ id: props.errors.name })
                  : ''
              }
            />
          </div>
          <div className={`mb4 ${styles.returnFormInput}`}>
            <Input
              disabled
              name="email"
              placeholder={intl.formatMessage({
                id: messages.formEmail.id,
              })}
              onChange={props.handleInputChange}
              value={props.formInputs.email}
              errorMessage={
                props.errors.email
                  ? intl.formatMessage({ id: props.errors.email })
                  : ''
              }
            />
          </div>
          <div className={`mb4 ${styles.returnFormInput}`}>
            <Input
              name="phone"
              placeholder={intl.formatMessage({ id: messages.formPhone.id })}
              onChange={props.handleInputChange}
              value={props.formInputs.phone}
              errorMessage={
                props.errors.phone
                  ? intl.formatMessage({ id: props.errors.phone })
                  : ''
              }
            />
          </div>
        </div>

        <div
          className={`flex-ns flex-wrap flex-auto flex-column mr3 pa4 ${styles.returnFormInputsColumn} ${styles.returnFormInputsColumnRight}`}
        >
          <div className="flex justify-between items-center ">
            {isPickupPointsSelected ? (
              <p className={`${styles.returnFormInputsHeader}`}>
                Pickup Points
              </p>
            ) : (
              <p className={`${styles.returnFormInputsHeader}`}>
                {intl.formatMessage({ id: messages.formPickupAddress.id })}
              </p>
            )}
            {props.settings.enablePickupPoints ? (
              <Toggle
                label={isPickupPointsSelected ? '' : 'Pickup Points'}
                checked={isPickupPointsSelected}
                onChange={() =>
                  setIsPickupPointsSelected(!isPickupPointsSelected)
                }
              />
            ) : null}
          </div>
          {/* working */}
          {isPickupPointsSelected ? (
            <Dropdown
              label=""
              placeholder="Select Pickup"
              size="small"
              options={dropdownOptionsPickupPoints}
              value={selectedPickupPoint}
              onChange={handlePickupPointSelected}
            />
          ) : (
            <>
              <div className={`mb4 ${styles.returnFormInput}`}>
                <Input
                  name="address"
                  placeholder={intl.formatMessage({
                    id: messages.formAddress.id,
                  })}
                  onChange={props.handleInputChange}
                  value={props.formInputs.address}
                  errorMessage={
                    props.errors.address
                      ? intl.formatMessage({ id: props.errors.address })
                      : ''
                  }
                />
              </div>
              <div className={`mb4 ${styles.returnFormInput}`}>
                <Input
                  name="locality"
                  placeholder={intl.formatMessage({
                    id: messages.formLocality.id,
                  })}
                  onChange={props.handleInputChange}
                  value={props.formInputs.locality}
                  errorMessage={
                    props.errors.locality
                      ? intl.formatMessage({ id: props.errors.locality })
                      : ''
                  }
                />
              </div>
              <div className={`mb4 ${styles.returnFormInput}`}>
                <Input
                  name="state"
                  placeholder={intl.formatMessage({
                    id: messages.formState.id,
                  })}
                  onChange={props.handleInputChange}
                  value={props.formInputs.state || ''}
                  errorMessage={
                    props.errors.state
                      ? intl.formatMessage({ id: props.errors.state })
                      : ''
                  }
                />
              </div>
              <div className={`mb4 ${styles.returnFormInput}`}>
                <Input
                  name="zip"
                  placeholder={intl.formatMessage({ id: messages.formZip.id })}
                  onChange={props.handleInputChange}
                  value={props.formInputs.zip || ''}
                  errorMessage={
                    props.errors.zip
                      ? intl.formatMessage({ id: props.errors.zip })
                      : ''
                  }
                />
              </div>
              <div className={`mb4 ${styles.returnFormInput}`}>
                <Input
                  name="country"
                  placeholder={intl.formatMessage({
                    id: messages.formCountry.id,
                  })}
                  onChange={props.handleInputChange}
                  value={props.formInputs.country}
                  errorMessage={
                    props.errors.country
                      ? intl.formatMessage({ id: props.errors.country })
                      : ''
                  }
                />
              </div>
            </>
          )}
        </div>
        <div className={`mt4 ph4 ${styles.returnFormExtraComment}`}>
          <p className={`${styles.returnFormExtraCommentHeader}`}>
            {intl.formatMessage({ id: messages.formExtraComment.id })}
          </p>
          <div className={`${styles.returnFormExtraCommentInput}`}>
            <Textarea
              name="extraComment"
              resize="none"
              onChange={props.handleInputChange}
              maxLength="250"
              value={props.formInputs.extraComment}
            />
          </div>
        </div>
      </div>

      <div
        className={`flex-ns flex-wrap flex-auto flex-column pa4 ${styles.returnFormInputsPayment}`}
      >
        <p className={`${styles.returnFormInputsHeader}`}>
          {intl.formatMessage({ id: messages.formPaymentMethod.id })}
        </p>
        <RadioGroup
          hideBorder
          name="paymentMethod"
          options={paymentMethods()}
          value={props.formInputs.paymentMethod}
          errorMessage={
            props.errors.paymentMethod
              ? intl.formatMessage({ id: props.errors.paymentMethod })
              : ''
          }
          onChange={props.handleInputChange}
        />
        {props.formInputs.paymentMethod === 'bank' ? (
          <div>
            <div
              className={`flex-ns flex-wrap flex-auto flex-column mt4 ${styles.returnFormInputAccountHolder}`}
            >
              <Input
                name="accountHolder"
                placeholder={intl.formatMessage({
                  id: messages.formAccountHolder.id,
                })}
                onChange={props.handleInputChange}
                value={props.formInputs.accountHolder}
                errorMessage={
                  props.errors.accountHolder
                    ? intl.formatMessage({ id: props.errors.accountHolder })
                    : ''
                }
              />
            </div>
            <div
              className={`flex-ns flex-wrap flex-auto flex-column mt4 ${styles.returnFormInputIban}`}
            >
              <Input
                name="iban"
                placeholder={intl.formatMessage({ id: messages.formIBAN.id })}
                onChange={props.handleInputChange}
                value={props.formInputs.iban}
                errorMessage={
                  props.errors.iban
                    ? intl.formatMessage({ id: props.errors.iban })
                    : ''
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
          checked={props.formInputs.agree}
          id="agree"
          key="formAgreeCheckbox"
          label={renderTermsAndConditions()}
          name="agree"
          onChange={props.handleInputChange}
          value={props.formInputs.agree}
        />
        {props.errors.agree ? (
          <p
            className={`c-danger t-small mt3 lh-title ${styles.returnFormErrorAgree}`}
          >
            {intl.formatMessage({ id: props.errors.agree })}
          </p>
        ) : null}
      </div>

      <div className={`mt4 ph4 ${styles.returnFormActions}`}>
        <Button type="submit" variation="primary" onClick={props.handleSubmit}>
          {intl.formatMessage({ id: messages.formNextStep.id })}
        </Button>
      </div>
    </div>
  )
}

export default RequestForm
