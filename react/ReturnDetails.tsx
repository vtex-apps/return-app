import React, { FC } from "react";
import { Layout, PageHeader, PageBlock } from "vtex.styleguide";
import { useIntl } from "react-intl";

import ReturnForm from "./admin/ReturnForm";

const ReturnDetails: FC = props => {
  const intl = useIntl();
  return (
    <Layout fullWidth pageHeader={<PageHeader title="Request info" />}>
      <PageBlock variation={"full"}>
        <ReturnForm data={props} intl={intl} />
      </PageBlock>
    </Layout>
  );
};

export default ReturnDetails;
