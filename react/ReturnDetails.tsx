import React, { FC } from "react";
import { Layout, PageHeader } from "vtex.styleguide";
import { useIntl } from "react-intl";

import ReturnForm from "./admin/ReturnForm";

const ReturnDetails: FC = props => {
  const intl = useIntl();
  return (
    <Layout fullWidth pageHeader={<PageHeader title="Request info" />}>
      <ReturnForm data={props} intl={intl} />
    </Layout>
  );
};

export default ReturnDetails;
