import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Layout, PageBlock, PageHeader } from "vtex.styleguide";

import ReturnsTable from "./ReturnsTable";

export default class ReturnsRequests extends Component<{}, any> {
  public render() {
    return (
      <Layout
        fullWidth
        pageHeader={
          <PageHeader
            title={<FormattedMessage id="navigation.label" />}
          />
        }
      >
        <PageBlock variation="full">
          <ReturnsTable />
        </PageBlock>
      </Layout>
    );
  }
}
