/* eslint-disable @typescript-eslint/explicit-member-accessibility */
import React, { Component } from 'react'
import { defineMessages, injectIntl } from 'react-intl'
import {
  Layout,
  PageBlock,
  PageHeader,
  Input,
  Spinner,
  IconClear,
  Button,
  CheckboxGroup,
  IconDeny,
  Table,
  Modal,
  Divider,
} from 'vtex.styleguide'

import styles from '../styles.css'
import { schemaNames, schemaTypes, isInt, verifySchemas } from '../common/utils'
import { fetchHeaders, fetchMethod, fetchPath } from '../common/fetch'

const categoriesArray: any[] = []

const messages = defineMessages({
  formBank: { id: 'returns.formBank' },
  formCreditCard: { id: 'returns.formCreditCard' },
  formVoucher: { id: 'returns.formVoucher' },
  settingMin3Chars: { id: 'returns.settingMin3Chars' },
  settingsErrorDaysNumber: { id: 'returns.settingsErrorDaysNumber' },
  errorFieldRequired: { id: 'returns.errorFieldRequired' },
  paymentsFieldRequired: { id: 'returns.paymentsFieldRequired' },
  settingsSaved: { id: 'returns.settingsSaved' },
  labelSettings: { id: 'navigation.labelSettings' },
  updateSchema: { id: 'settings.updateSchema' },
  maxDaysLabel: { id: 'settings.maxDays_label' },
  termsLabel: { id: 'settings.terms_label' },
  searchCategories: { id: 'settings.searchCategories' },
  excludedCategories: { id: 'settings.excludedCategories' },
  paymentMethodsLabel: { id: 'settings.paymentMethods_label' },
  returnOptionsLabel: { id: 'settings.returnOptions_label' },
  noCustomOptions: { id: 'settings.noCustomOptions' },
  noCustomOptionsHowTo: { id: 'settings.noCustomOptions_HowTo' },
  noCustomOptionsDisclaimer: { id: 'settings.noCustomOptions_Disclaimer' },
  addCustomOption: { id: 'settings.addCustomOption' },
  deleteCustomOption: { id: 'settings.deleteCustomOption' },
  addCustomOptionHeader: { id: 'settings.addCustomOption_Header' },
  addCustomOptionRequired: { id: 'settings.addCustomOption_Required' },
  addCustomOptionName: { id: 'settings.addCustomOption_Name' },
  addCustomOptionDays: { id: 'settings.addCustomOption_Days' },
  addCustomOptionSubmit: { id: 'settings.addCustomOption_Submit' },
  all: { id: 'returns.all' },
  saveSettings: { id: 'settings.saveSettings' },
})

class ReturnsSettings extends Component<any, any> {
  constructor(props: any) {
    super(props)
    const { formatMessage } = this.props.intl

    this.state = {
      id: '',
      updatingSchema: false,
      maxDays: '',
      termsUrl: '',
      categoryFilterQuery: '',
      categoriesFilterError: '',
      categories: [],
      filteredCategories: [],
      excludedCategories: [],
      errors: {
        maxDays: '',
        termsUrl: '',
        payments: '',
        options: '',
      },
      paymentBank: false,
      paymentCard: false,
      paymentVoucher: false,
      successMessage: '',
      errorMessage: '',
      payments: {
        paymentBank: {
          label: formatMessage({ id: messages.formBank.id }),
          checked: true,
        },
        paymentCard: {
          label: formatMessage({ id: messages.formCreditCard.id }),
          checked: true,
        },
        paymentVoucher: {
          label: formatMessage({ id: messages.formVoucher.id }),
          checked: true,
        },
      },
      options: [],
      loading: false,
      categorySearchLoading: false,
      isModalOpen: false,
    }
  }

  getCategories = () => {
    this.setState({ loading: true })
    fetch(fetchPath.getCategories, {
      method: fetchMethod.get,
      headers: fetchHeaders,
    })
      .then((response) => response.json())
      .then((json) => {
        if (json) {
          const categoriesArr = this.renderCategories(json)

          this.setState({ categories: categoriesArr, loading: false })
        }
      })
      .catch((err) => this.setState({ error: err }))
  }

  getSettings = async () => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    this.setState({ ...this.state, loading: true })
    await fetch(
      `${fetchPath.getDocuments + schemaNames.settings}/${
        schemaTypes.settings
      }/1`,
      {
        method: fetchMethod.get,
        headers: fetchHeaders,
      }
    )
      .then((response) => {
        return response.json()
      })
      .then((json) => {
        if (!json?.[0]) return
        const { payments } = this.state
        let updatedPayments = {}
        const paymentBank =
          json[0].paymentBank !== null ? json[0].paymentBank : false

        const paymentCard =
          json[0].paymentCard !== null ? json[0].paymentCard : false

        const paymentVoucher =
          json[0].paymentVoucher !== null ? json[0].paymentVoucher : false

        updatedPayments = {
          paymentCard: {
            ...payments.paymentCard,
            checked: paymentCard,
          },
          paymentBank: {
            ...payments.paymentBank,
            checked: paymentBank,
          },
          paymentVoucher: {
            ...payments.paymentVoucher,
            checked: paymentVoucher,
          },
        }
        this.setState({
          id: json[0].id,
          maxDays: json[0].maxDays,
          termsUrl: json[0].termsUrl,
          paymentBank,
          paymentCard,
          paymentVoucher,
          payments: updatedPayments,
          options: json[0].options || [],
          excludedCategories: JSON.parse(json[0].excludedCategories),
          loading: false,
        })
      })
      .catch((err) => this.setState({ error: err }))
  }

  renderCategories(categories: any, parent: string | null = null) {
    if (categories) {
      Object.keys(categories).forEach((k) => {
        const currentCategory = categories[k]
        const currentCategoryName = parent
          ? `${parent} > ${currentCategory.name}`
          : currentCategory.name

        categoriesArray.push({
          id: currentCategory.id,
          name: currentCategoryName,
        })

        if (currentCategory.children.length) {
          this.renderCategories(currentCategory.children, currentCategoryName)
        }
      })
    }

    return categoriesArray
  }

  componentDidMount(): void {
    this.checkSchemas()
    this.getCategories()
    this.getSettings()
  }

  async checkSchemas() {
    const check = await verifySchemas()

    if (check) {
      this.setState({ updatingSchema: check })
      try {
        await fetch(fetchPath.generateSchema, {
          method: fetchMethod.put,
          headers: fetchHeaders,
        })
      } catch (error) {
        console.error(error)
      }
    }
  }

  filterCategories = (query: string) => {
    const { categories, excludedCategories } = this.state
    const { formatMessage } = this.props.intl
    const matches: any[] = []

    this.setState({
      categoriesFilterError: '',
      categoryFilterQuery: query,
      categorySearchLoading: true,
    })

    if (query.length && query.length < 3) {
      this.setState({
        categoriesFilterError: formatMessage({
          id: messages.settingMin3Chars.id,
        }),
      })
    }

    categories.forEach((category: any) => {
      if (category.name.toLowerCase().includes(query.toLocaleLowerCase())) {
        matches.push(category)
      }
    })

    for (let i = matches.length - 1; i >= 0; i--) {
      for (let j = 0; j < excludedCategories.length; j++) {
        if (matches[i] && matches[i].id === excludedCategories[j].id) {
          matches.splice(i, 1)
        }
      }
    }

    if (query.length && query.length >= 3) {
      this.setState({ filteredCategories: matches })
    } else {
      this.setState({ filteredCategories: [] })
    }

    setTimeout(() => {
      this.setState({ categorySearchLoading: false })
    }, 1000)
  }

  excludeCategory = (category: any) => {
    const { excludedCategories } = this.state

    this.setState({
      excludedCategories: [...excludedCategories, category],
      filteredCategories: [],
      categoryFilterQuery: '',
    })
  }

  removeExcludedCategory = (category: any) => {
    const { excludedCategories } = this.state
    const newExcludedCategories = excludedCategories.filter(
      (item: any) => item.id !== category.id
    )

    this.setState({
      excludedCategories: newExcludedCategories,
      filteredCategories: [],
      categoryFilterQuery: '',
    })
  }

  saveSettings = () => {
    const { formatMessage } = this.props.intl

    this.setState({
      errors: {
        maxDays: '',
        termsUrl: '',
        payments: '',
      },
      successMessage: '',
      errorMessage: '',
      loading: true,
    })
    const { maxDays, excludedCategories, termsUrl, id, payments, options } =
      this.state

    let hasErrors = false

    if (!maxDays) {
      this.setState((prevState: any) => ({
        errors: {
          ...prevState.errors,
          maxDays: formatMessage({ id: messages.settingsErrorDaysNumber.id }),
        },
      }))
      hasErrors = true
    }

    if (!termsUrl) {
      this.setState((prevState: any) => ({
        errors: {
          ...prevState.errors,
          termsUrl: formatMessage({ id: messages.errorFieldRequired.id }),
        },
      }))
      hasErrors = true
    }

    if (
      !payments.paymentBank.checked &&
      !payments.paymentCard.checked &&
      !payments.paymentVoucher.checked
    ) {
      this.setState((prevState: any) => ({
        errors: {
          ...prevState.errors,
          payments: formatMessage({ id: messages.paymentsFieldRequired.id }),
        },
      }))
      hasErrors = true
    }

    if (hasErrors) {
      this.setState({ loading: false })

      return
    }

    const postData = {
      id,
      maxDays: parseInt(maxDays, 10),
      excludedCategories: JSON.stringify(excludedCategories),
      termsUrl,
      paymentCard: payments.paymentCard.checked,
      paymentBank: payments.paymentBank.checked,
      paymentVoucher: payments.paymentVoucher.checked,
      options,
      type: schemaTypes.settings,
    }

    this.saveMasterData(postData)
  }

  saveMasterData = (postData: any) => {
    const { formatMessage } = this.props.intl

    fetch(`${fetchPath.saveDocuments + schemaNames.settings}/`, {
      method: fetchMethod.post,
      body: JSON.stringify(postData),
      headers: fetchHeaders,
    })
      .then((response) => response)
      .then(() => {
        this.setState({
          successMessage: formatMessage({ id: messages.settingsSaved.id }),
          loading: false,
        })
      })
      .catch((err) => this.setState({ loading: false, errorMessage: err }))
  }

  clearCategoriesSearch = () => {
    this.setState({ categoryFilterQuery: '', filteredCategories: [] })
  }

  removeOption = (reference: any) => {
    this.setState((prevState) => {
      const filteredOptions = prevState.options.filter(
        (item: any) =>
          item.optionName !== reference.optionName ||
          item.maxOptionDay !== reference.maxOptionDay
      )

      return { options: filteredOptions }
    })
  }

  handleModalToggle = () => {
    this.setState((prevState) => ({ isModalOpen: !prevState.isModalOpen }))
  }

  handleSubmitOption = (e: any) => {
    e.preventDefault()
    const { optionName, maxOptionDay } = e.target.elements

    this.setState((prevState: any) => ({
      options: [
        ...prevState.options,
        {
          optionName: optionName.value,
          maxOptionDay: maxOptionDay.value
            ? Number(maxOptionDay.value)
            : Number(prevState.maxDays),
        },
      ],
    }))
    this.handleModalToggle()
  }

  render() {
    const {
      maxDays,
      termsUrl,
      excludedCategories,
      categoryFilterQuery,
      filteredCategories,
      categoriesFilterError,
      errors,
      successMessage,
      errorMessage,
      loading,
      categorySearchLoading,
      updatingSchema,
      payments,
      options,
      isModalOpen,
    } = this.state

    const { formatMessage } = this.props.intl
    const optionsTableSchema = {
      properties: {
        optionName: {
          title: formatMessage({
            id: messages.addCustomOptionName.id,
          }),
          width: 350,
        },
        maxOptionDay: {
          title: formatMessage({
            id: messages.addCustomOptionDays.id,
          }),
        },
      },
    }

    return (
      <Layout
        pageHeader={
          <PageHeader
            title={formatMessage({ id: messages.labelSettings.id })}
          />
        }
      >
        <PageBlock variation="full">
          {updatingSchema ? (
            <div className="flex flex-column justify-center items-center">
              {formatMessage({ id: messages.updateSchema.id })}
              <div className="pt6 pb6">
                <Spinner />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-column">
                <div className="flex flex-row">
                  <div className="w-50 ph1">
                    <Input
                      value={maxDays}
                      size="regular"
                      label={formatMessage({ id: messages.maxDaysLabel.id })}
                      onChange={(e) =>
                        this.setState({ maxDays: e.target.value })
                      }
                      errorMessage={errors.maxDays}
                    />
                  </div>
                  <div className="w-50 ph1">
                    <Input
                      value={termsUrl}
                      size="regular"
                      label={formatMessage({ id: messages.termsLabel.id })}
                      onChange={(e) =>
                        this.setState({ termsUrl: e.target.value })
                      }
                      errorMessage={errors.termsUrl}
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-column mt6">
                <div className="flex flex-column w-100">
                  <Input
                    value={categoryFilterQuery}
                    size="regular"
                    label={formatMessage({ id: messages.searchCategories.id })}
                    onChange={(e) => {
                      this.filterCategories(e.target.value)
                    }}
                    errorMessage={categoriesFilterError}
                    suffix={
                      categoryFilterQuery ? (
                        <button
                          className={styles.transparentButton}
                          onClick={() => {
                            this.clearCategoriesSearch()
                          }}
                        >
                          <IconClear />
                        </button>
                      ) : null
                    }
                  />

                  {filteredCategories.length ? (
                    <div
                      className={`${styles.filteredCategoriesContainer} br--bottom br2 bb bl br bw1 b--muted-3 bg-base w-100 z-1 shadow-5`}
                    >
                      {categorySearchLoading ? (
                        <div className="flex justify-center pt6 pb6">
                          <Spinner />
                        </div>
                      ) : (
                        filteredCategories.map((category: any) => (
                          <button
                            className={`bn w-100 tl pointer pa4 f6 bg-base ${styles.filteredCategoriesItem}`}
                            key={`excludeCategory-${category.id}`}
                            onClick={() => {
                              this.excludeCategory(category)
                            }}
                          >
                            {category.name}
                          </button>
                        ))
                      )}
                    </div>
                  ) : null}
                </div>
                <div className="flex flex-column w-100 mb6">
                  <p>{formatMessage({ id: messages.excludedCategories.id })}</p>
                  {excludedCategories.length ? (
                    <div className="flex flex-column">
                      {excludedCategories.map((category: any) => (
                        <button
                          className={`bn w-100 tl pointer pa4 f6 bg-base ${styles.filteredCategoriesItem} ${styles.excludedCategoriesItem}`}
                          key={`removeExcludeCategory-${category.id}`}
                          onClick={() => {
                            this.removeExcludedCategory(category)
                          }}
                        >
                          {category.name}{' '}
                          <span className={`${styles.statusDenied}`}>
                            <IconDeny size={12} />
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <Divider orientation="horizontal" />
                <div className="flex flex-column w-100">
                  <p className="f4 mb6">
                    {formatMessage({ id: messages.paymentMethodsLabel.id })}
                  </p>
                  <CheckboxGroup
                    name="simpleCheckboxGroup"
                    label={formatMessage({ id: messages.all.id })}
                    id="simple"
                    value="simple"
                    checkedMap={payments}
                    onGroupChange={(newCheckedMap) => {
                      this.setState({ payments: newCheckedMap })
                    }}
                  />

                  {errors.payments && (
                    <p className={`${styles.errorMessage}`}>
                      {errors.payments}
                    </p>
                  )}
                </div>
                <Divider orientation="horizontal" />
                <div className="flex flex-column w-100 mb7">
                  <p className="f4 mb0">
                    {formatMessage({ id: messages.returnOptionsLabel.id })}
                  </p>
                  <Table
                    fullWidth
                    schema={optionsTableSchema}
                    items={options}
                    emptyStateLabel={formatMessage({
                      id: messages.noCustomOptions.id,
                    })}
                    emptyStateChildren={
                      <React.Fragment>
                        <p>
                          {formatMessage({
                            id: messages.noCustomOptionsHowTo.id,
                          })}
                        </p>
                        <p>
                          {formatMessage({
                            id: messages.noCustomOptionsDisclaimer.id,
                          })}
                        </p>
                      </React.Fragment>
                    }
                    toolbar={{
                      newLine: {
                        label: formatMessage({
                          id: messages.addCustomOption.id,
                        }),
                        handleCallback: this.handleModalToggle,
                      },
                    }}
                    lineActions={[
                      {
                        isDangerous: true,
                        label: () =>
                          formatMessage({
                            id: messages.deleteCustomOption.id,
                          }),
                        onClick: ({ rowData }) => this.removeOption(rowData),
                      },
                    ]}
                  />
                  <Modal isOpen={isModalOpen} onClose={this.handleModalToggle}>
                    <div className="flex flex-column">
                      <div className="w-100">
                        <p className="f3 fw3 gray mt6 mb2">
                          {formatMessage({
                            id: messages.addCustomOptionHeader.id,
                          })}
                        </p>
                      </div>
                      <div className="w-100 mv4">
                        <form
                          onSubmit={this.handleSubmitOption}
                          className="flex flex-column items-baseline"
                        >
                          <div className="w-100 mv3">
                            <Input
                              placeholder={formatMessage({
                                id: messages.addCustomOptionRequired.id,
                              })}
                              label={formatMessage({
                                id: messages.addCustomOptionName.id,
                              })}
                              name="optionName"
                              size="large"
                              required
                            />
                          </div>
                          <div className="w-100 mt3 mb6">
                            <Input
                              placeholder={formatMessage({
                                id: messages.addCustomOptionRequired.id,
                              })}
                              label={formatMessage({
                                id: messages.addCustomOptionDays.id,
                              })}
                              name="maxOptionDay"
                              size="large"
                              type="number"
                              min="1"
                              max={maxDays}
                            />
                          </div>
                          <Button type="submit">
                            {formatMessage({
                              id: messages.addCustomOptionSubmit.id,
                            })}
                          </Button>
                        </form>
                      </div>
                    </div>
                  </Modal>
                  {errors.options && (
                    <p className={`${styles.errorMessage}`}>{errors.options}</p>
                  )}
                </div>
              </div>
              <Divider orientation="horizontal" />
              {successMessage ? (
                <div className="flex flex-column mt6">
                  <p className={styles.successMessage}>{successMessage}</p>
                </div>
              ) : null}
              {errorMessage ? (
                <div className="flex flex-column mt6">
                  <p className={styles.errorMessage}>
                    {JSON.stringify(errorMessage)}
                  </p>
                </div>
              ) : null}
              {!loading ? (
                <div className="flex flex-column mt6">
                  <Button
                    variation="primary"
                    onClick={() => {
                      this.saveSettings()
                    }}
                  >
                    {formatMessage({ id: messages.saveSettings.id })}
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </PageBlock>
      </Layout>
    )
  }
}

export default injectIntl(ReturnsSettings)
