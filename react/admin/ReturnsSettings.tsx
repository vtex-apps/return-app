import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Layout, PageBlock, PageHeader } from "vtex.styleguide";

import schemas from "../masterdata/schema";

export default class ReturnsSettings extends Component<{}, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      maxDays: "",
      termsUrl: "",
      categories: [],
      excludedCategories: []
    };
  }

  nestedLoop(obj: object) {
    const res: any = {};
    function recurse(obj: any, current: any = {}) {
      for (const key in obj) {
        const value = obj[key];
        if (value.children.length) {
          recurse(value.children, key);
        } else {
          res[key] = value;
        }
      }
    }
    recurse(obj);
    return res;
  }

  getCategories = () => {
    fetch("/returns/getCategories", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json) {
          this.setState({ categories: json });
        }
      })
      .catch(err => this.setState({ error: err }));
  };

  componentDidMount(): void {
    this.getCategories();
  }

  render() {
    const { maxDays, termsUrl, excludedCategories, categories } = this.state;
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
            <label htmlFor={"maxDays"}>Max days:</label>
            <input
              type={"text"}
              className={`form-control w-100 br2 ba b--light-gray pa2`}
              name={"maxDays"}
              value={maxDays}
              onChange={e => this.setState({ maxDays: e.target.value })}
            />
          </div>
          <div className={`flex flex-column mt6`}>
            <label htmlFor={"terms"}>Terms and conditions URL:</label>
            <input
              name={"terms"}
              className={`form-control w-100 br2 ba b--light-gray pa2`}
              type={"text"}
              value={termsUrl}
              onChange={e => this.setState({ termsUrl: e.target.value })}
            />
          </div>
        </PageBlock>
      </Layout>
    );
  }
}
