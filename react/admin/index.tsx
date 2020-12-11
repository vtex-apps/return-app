import React, { Component } from "react";
import { FormattedMessage } from "react-intl";
import { Layout, PageBlock, PageHeader } from "vtex.styleguide";

import ReturnsTable from "./ReturnsTable";

export default class ReturnsRequests extends Component<{}, any> {
  public render() {
    return (
      <Layout
        pageHeader={
          <PageHeader
            title={<FormattedMessage id="admin/navigation.label" />}
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
