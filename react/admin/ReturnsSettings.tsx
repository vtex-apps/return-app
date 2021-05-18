import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import {
  Layout,
  PageBlock,
  PageHeader,
  Input,
  Spinner,
  IconClear,
  Button,
  CheckboxGroup,
  IconDeny
} from "vtex.styleguide";

import styles from "../styles.css";
import {
  schemaNames,
  schemaTypes,
  isInt,
  FormattedMessageFixed,
  verifySchemas
} from "../common/utils";
import { fetchHeaders, fetchMethod, fetchPath } from "../common/fetch";

const categoriesArray: any[] = [];

export default class ReturnsSettings extends Component<{}, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      id: "",
      updatingSchema: false,
      maxDays: "",
      termsUrl: "",
      categoryFilterQuery: "",
      categoriesFilterError: "",
      categories: [],
      filteredCategories: [],
      excludedCategories: [],
      errors: {
        maxDays: "",
        termsUrl: "",
        payments: ""
      },
      paymentBank: false,
      paymentCard: false,
      paymentVoucher: false,
      successMessage: "",
      errorMessage: "",
      payments: {
        paymentBank: {
          label: <FormattedMessage id={`admin/returns.formBank`} />,
          checked: true
        },
        paymentCard: {
          label: <FormattedMessage id={`admin/returns.formCreditCard`} />,
          checked: true
        },
        paymentVoucher: {
          label: <FormattedMessage id={`admin/returns.formVoucher`} />,
          checked: true
        }
      },
      loading: false,
      categorySearchLoading: false
    };
  }

  getCategories = () => {
    this.setState({ loading: true });
    fetch(fetchPath.getCategories, {
      method: fetchMethod.get,
      headers: fetchHeaders
    })
      .then(response => response.json())
      .then(json => {
        if (json) {
          const categoriesArr = this.renderCategories(json);
          this.setState({ categories: categoriesArr, loading: false });
        }
      })
      .catch(err => this.setState({ error: err }));
  };

  getSettings = () => {
    this.setState({ loading: true });
    fetch(
      fetchPath.getDocuments +
        schemaNames.settings +
        "/" +
        schemaTypes.settings +
        "/1",
      {
        method: fetchMethod.get,
        headers: fetchHeaders
      }
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json && json[0]) {
          const { payments } = this.state;
          let updatedPayments = {};
          const paymentBank =
            json[0].paymentBank !== null ? json[0].paymentBank : false;
          const paymentCard =
            json[0].paymentCard !== null ? json[0].paymentCard : false;
          const paymentVoucher =
            json[0].paymentVoucher !== null ? json[0].paymentVoucher : false;

          updatedPayments = {
            paymentCard: {
              ...payments.paymentCard,
              checked: paymentCard
            },
            paymentBank: {
              ...payments.paymentBank,
              checked: paymentBank
            },
            paymentVoucher: {
              ...payments.paymentVoucher,
              checked: paymentVoucher
            }
          };
          this.setState({
            id: json[0].id,
            maxDays: json[0].maxDays,
            termsUrl: json[0].termsUrl,
            paymentBank,
            paymentCard,
            paymentVoucher,
            payments: updatedPayments,
            excludedCategories: JSON.parse(json[0].excludedCategories),
            loading: false
          });
        }
      })
      .catch(err => this.setState({ error: err }));
  };

  renderCategories(categories: any, parent: string | null = null) {
    if (categories) {
      Object.keys(categories).map(k => {
        const currentCategory = categories[k];
        const currentCategoryName = parent
          ? parent + " > " + currentCategory["name"]
          : currentCategory["name"];

        categoriesArray.push({
          id: currentCategory["id"],
          name: currentCategoryName
        });

        if (currentCategory["children"].length) {
          this.renderCategories(
            currentCategory["children"],
            currentCategoryName
          );
        }
      });
    }
    return categoriesArray;
  }

  componentDidMount(): void {
    this.checkSchemas();
    this.getCategories();
    this.getSettings();
  }

  async checkSchemas() {
    const check = await verifySchemas();

    if (check) {
      this.setState({ updatingSchema: check });
      await fetch(fetchPath.generateSchema, {
        method: fetchMethod.put,
        headers: fetchHeaders
      });

      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
  }

  filterCategories = (query: string) => {
    const { categories, excludedCategories } = this.state;
    const matches: any[] = [];
    this.setState({
      categoriesFilterError: "",
      categoryFilterQuery: query,
      categorySearchLoading: true
    });

    if (query.length && query.length < 3) {
      this.setState({
        categoriesFilterError: (
          <FormattedMessageFixed id={"admin/returns.settingMin3Chars"} />
        )
      });
    }

    categories.map((category: any) => {
      if (category.name.toLowerCase().includes(query.toLocaleLowerCase())) {
        matches.push(category);
      }
    });

    for (let i = matches.length - 1; i >= 0; i--) {
      for (let j = 0; j < excludedCategories.length; j++) {
        if (matches[i] && matches[i].id === excludedCategories[j].id) {
          matches.splice(i, 1);
        }
      }
    }

    if (query.length && query.length >= 3) {
      this.setState({ filteredCategories: matches });
    } else {
      this.setState({ filteredCategories: [] });
    }

    setTimeout(() => {
      this.setState({ categorySearchLoading: false });
    }, 1000);
  };

  excludeCategory = (category: any) => {
    const { excludedCategories } = this.state;

    this.setState({
      excludedCategories: [...excludedCategories, category],
      filteredCategories: [],
      categoryFilterQuery: ""
    });
  };

  removeExcludedCategory = (category: any) => {
    const { excludedCategories } = this.state;
    const newExcludedCategories = excludedCategories.filter(
      (item: any) => item.id !== category.id
    );
    this.setState({
      excludedCategories: newExcludedCategories,
      filteredCategories: [],
      categoryFilterQuery: ""
    });
  };
  saveSettings = () => {
    this.setState({
      errors: {
        maxDays: "",
        termsUrl: "",
        payments: ""
      },
      successMessage: "",
      errorMessage: "",
      loading: true
    });
    const { maxDays, excludedCategories, termsUrl, id, payments } = this.state;
    let hasErrors = false;
    if (!maxDays || !isInt(maxDays)) {
      this.setState((prevState: any) => ({
        errors: {
          ...prevState.errors,
          maxDays: (
            <FormattedMessageFixed
              id={"admin/returns.settingsErrorDaysNumber"}
            />
          )
        }
      }));
      hasErrors = true;
    }
    if (!termsUrl) {
      this.setState((prevState: any) => ({
        errors: {
          ...prevState.errors,
          termsUrl: (
            <FormattedMessageFixed id={"admin/returns.errorFieldRequired"} />
          )
        }
      }));
      hasErrors = true;
    }
    if (
      !payments.paymentBank.checked &&
      !payments.paymentCard.checked &&
      !payments.paymentVoucher.checked
    ) {
      this.setState((prevState: any) => ({
        errors: {
          ...prevState.errors,
          payments: (
            <FormattedMessageFixed id={"admin/returns.paymentsFieldRequired"} />
          )
        }
      }));
      hasErrors = true;
    }

    if (hasErrors) {
      this.setState({ loading: false });
      return;
    }

    const postData = {
      id: id,
      maxDays: parseInt(maxDays),
      excludedCategories: JSON.stringify(excludedCategories),
      termsUrl: termsUrl,
      paymentCard: payments.paymentCard.checked,
      paymentBank: payments.paymentBank.checked,
      paymentVoucher: payments.paymentVoucher.checked,
      type: schemaTypes.settings
    };

    this.saveMasterData(postData);
  };

  saveMasterData = (postData: any) => {
    fetch(fetchPath.saveDocuments + schemaNames.settings + "/", {
      method: fetchMethod.post,
      body: JSON.stringify(postData),
      headers: fetchHeaders
    })
      .then(response => response)
      .then(json => {
        this.setState({
          successMessage: (
            <FormattedMessageFixed id={"admin/returns.settingsSaved"} />
          ),
          loading: false
        });
        setTimeout(() => {
          window.location.reload();
        }, 2500);
      })
      .catch(err => this.setState({ loading: false, errorMessage: err }));
  };

  clearCategoriesSearch = () => {
    this.setState({ categoryFilterQuery: "", filteredCategories: [] });
  };

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
      payments
    } = this.state;

    return (
      <Layout
        pageHeader={
          <PageHeader
            title={<FormattedMessage id="admin/navigation.labelSettings" />}
          />
        }
      >
        <PageBlock variation="full">
          {updatingSchema ? (
            <div className={`flex flex-column justify-center items-center`}>
              <FormattedMessage id={"admin/settings.updateSchema"} />
              <div className={`pt6 pb6`}>
                <Spinner />
              </div>
            </div>
          ) : (
            <div>
              <div className={`flex flex-column`}>
                <div className={`flex flex-row`}>
                  <div className={`w-50 ph1`}>
                    <FormattedMessage id={"admin/settings.maxDays_label"}>
                      {msg => (
                        <Input
                          value={maxDays}
                          size="regular"
                          label={msg}
                          onChange={e =>
                            this.setState({ maxDays: e.target.value })
                          }
                          errorMessage={errors.maxDays}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                  <div className={`w-50 ph1`}>
                    <FormattedMessage id={"admin/settings.terms_label"}>
                      {msg => (
                        <Input
                          value={termsUrl}
                          size="regular"
                          label={msg}
                          onChange={e =>
                            this.setState({ termsUrl: e.target.value })
                          }
                          errorMessage={errors.termsUrl}
                        />
                      )}
                    </FormattedMessage>
                  </div>
                </div>
              </div>
              <div className={`flex flex-column mt6`}>
                <div className={`flex flex-column w-100`}>
                  <FormattedMessage id={"admin/settings.searchCategories"}>
                    {msg => (
                      <Input
                        value={categoryFilterQuery}
                        size="regular"
                        label={msg}
                        onChange={e => {
                          this.filterCategories(e.target.value);
                        }}
                        errorMessage={categoriesFilterError}
                        suffix={
                          categoryFilterQuery ? (
                            <button
                              className={styles.transparentButton}
                              onClick={() => {
                                this.clearCategoriesSearch();
                              }}
                            >
                              <IconClear />
                            </button>
                          ) : null
                        }
                      />
                    )}
                  </FormattedMessage>
                  {filteredCategories.length ? (
                    <div
                      className={`${styles.filteredCategoriesContainer} br--bottom br2 bb bl br bw1 b--muted-3 bg-base w-100 z-1 shadow-5`}
                    >
                      {categorySearchLoading ? (
                        <div className={`flex justify-center pt6 pb6`}>
                          <Spinner />
                        </div>
                      ) : (
                        filteredCategories.map((category: any) => (
                          <button
                            className={`bn w-100 tl pointer pa4 f6 bg-base ${styles.filteredCategoriesItem}`}
                            key={"excludeCategory-" + category.id}
                            onClick={() => {
                              this.excludeCategory(category);
                            }}
                          >
                            {category.name}
                          </button>
                        ))
                      )}
                    </div>
                  ) : null}
                </div>
                <div className={`flex flex-column w-100`}>
                  <p>
                    <FormattedMessage
                      id={"admin/settings.excludedCategories"}
                    />
                  </p>
                  {excludedCategories.length ? (
                    <div className={`flex flex-column`}>
                      {excludedCategories.map((category: any) => (
                        <button
                          className={`bn w-100 tl pointer pa4 f6 bg-base ${styles.filteredCategoriesItem} ${styles.excludedCategoriesItem}`}
                          key={"removeExcludeCategory-" + category.id}
                          onClick={() => {
                            this.removeExcludedCategory(category);
                          }}
                        >
                          {category.name}{" "}
                          <span className={`${styles.statusDenied}`}>
                            <IconDeny size={12} />
                          </span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
                <div className={`flex flex-column w-100`}>
                  <p>
                    <FormattedMessage
                      id={"admin/settings.paymentMethods_label"}
                    />
                  </p>
                  <FormattedMessage id={"admin/returns.all"}>
                    {msg => (
                      <CheckboxGroup
                        name="simpleCheckboxGroup"
                        label={msg}
                        id="simple"
                        value="simple"
                        checkedMap={payments}
                        onGroupChange={newCheckedMap => {
                          this.setState({ payments: newCheckedMap });
                        }}
                      />
                    )}
                  </FormattedMessage>
                  {errors.payments && (
                    <p className={`${styles.errorMessage}`}>
                      {errors.payments}
                    </p>
                  )}
                </div>
              </div>
              {successMessage ? (
                <div className={`flex flex-column mt6`}>
                  <p className={styles.successMessage}>{successMessage}</p>
                </div>
              ) : null}
              {errorMessage ? (
                <div className={`flex flex-column mt6`}>
                  <p className={styles.errorMessage}>
                    {JSON.stringify(errorMessage)}
                  </p>
                </div>
              ) : null}
              {!loading ? (
                <div className={`flex flex-column mt6`}>
                  <Button
                    variation="primary"
                    onClick={() => {
                      this.saveSettings();
                    }}
                  >
                    <FormattedMessage id={"admin/settings.saveSettings"} />
                  </Button>
                </div>
              ) : null}
            </div>
          )}
        </PageBlock>
      </Layout>
    );
  }
}
