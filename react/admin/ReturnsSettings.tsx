import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import {
  Layout,
  PageBlock,
  PageHeader,
  Input,
  Spinner,
  IconClear,
  Button
} from "vtex.styleguide";

import styles from "../styles.css";
import { schemaNames, schemaTypes } from "../common/utils";

const categoriesArray: any[] = [];

export default class ReturnsSettings extends Component<{}, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      documentId: "",
      maxDays: "",
      termsUrl: "",
      categoryFilterQuery: "",
      categoriesFilterError: "",
      categories: [],
      filteredCategories: [],
      excludedCategories: [],
      errors: {
        maxDays: "",
        termsUrl: ""
      },
      successMessage: "",
      errorMessage: "",
      loading: false,
      categorySearchLoading: false
    };
  }

  getCategories = () => {
    this.setState({ loading: true });
    fetch("/returns/getCategories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
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
      "/returns/getDocuments/" +
        schemaNames.settings +
        "/" +
        schemaTypes.settings +
        "/1",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      }
    )
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json && json[0]) {
          this.setState({
            documentId: json[0].id,
            maxDays: json[0].maxDays,
            termsUrl: json[0].termsUrl,
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
    this.getCategories();
    this.getSettings();
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
      this.setState({ categoriesFilterError: "Enter at least 3 characters" });
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

  isInt(value: any) {
    return (
      !isNaN(value) &&
      parseInt(String(Number(value))) == value &&
      !isNaN(parseInt(String(value), 10))
    );
  }

  saveSettings = () => {
    this.setState({
      errors: {
        maxDays: "",
        termsUrl: ""
      },
      successMessage: "",
      errorMessage: "",
      loading: true
    });
    const { maxDays, excludedCategories, termsUrl, documentId } = this.state;
    let hasErrors = false;
    if (!maxDays || !this.isInt(maxDays)) {
      this.setState((prevState: any) => ({
        errors: {
          ...prevState.errors,
          maxDays: "Please provide a numeric number of days"
        }
      }));
      hasErrors = true;
    }
    if (!termsUrl) {
      this.setState((prevState: any) => ({
        errors: {
          ...prevState.errors,
          termsUrl: "This field is required"
        }
      }));
      hasErrors = true;
    }

    if (hasErrors) {
      this.setState({ loading: false });
      return;
    }

    const postData = {
      maxDays: parseInt(maxDays),
      excludedCategories: JSON.stringify(excludedCategories),
      termsUrl: termsUrl,
      type: "settings"
    };

    if (this.state.documentId) {
      this.updateDocument(documentId, postData);
    } else {
      this.createDocument(postData);
    }
  };

  createDocument = (postData: any) => {
    fetch("/returns/saveDocuments/" + schemaNames.settings + "/", {
      method: "POST",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response)
      .then(json => {
        this.setState({ successMessage: "Settings saved!", loading: false });
      })
      .catch(err => this.setState({ loading: false, errorMessage: err }));
  };

  updateDocument = (documentId: string, postData: any) => {
    fetch("/returns/updateDocuments/" + documentId, {
      method: "PUT",
      body: JSON.stringify(postData),
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response)
      .then(json => {
        this.setState({ successMessage: "Settings updated!", loading: false });
      })
      .catch(err => this.setState({ errorMessage: err, loading: false }));
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
      categorySearchLoading
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
          <div className={`flex flex-column`}>
            <FormattedMessage id={"admin/settings.maxDays_label"}>
              {msg => (
                <Input
                  value={maxDays}
                  size="regular"
                  label={msg}
                  onChange={e => this.setState({ maxDays: e.target.value })}
                  errorMessage={errors.maxDays}
                />
              )}
            </FormattedMessage>
          </div>
          <div className={`flex flex-column mt6`}>
            <FormattedMessage id={"admin/settings.terms_label"}>
              {msg => (
                <Input
                  value={termsUrl}
                  size="regular"
                  label={msg}
                  onChange={e => this.setState({ termsUrl: e.target.value })}
                  errorMessage={errors.termsUrl}
                />
              )}
            </FormattedMessage>
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
                <FormattedMessage id={"admin/settings.excludedCategories"} />
              </p>
              {excludedCategories.length ? (
                <div className={`flex flex-column`}>
                  {excludedCategories.map((category: any) => (
                    <button
                      className={`bn w-100 tl pointer pa4 f6 bg-base ${styles.filteredCategoriesItem}`}
                      key={"removeExcludeCategory-" + category.id}
                      onClick={() => {
                        this.removeExcludedCategory(category);
                      }}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              ) : null}
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
        </PageBlock>
      </Layout>
    );
  }
}
