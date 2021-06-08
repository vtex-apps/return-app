import React from "react";
import { Route } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import ReturnsDetails from "./store/ReturnsDetails";

const headerConfig = {
  namespace: "vtex-account__returns-list",
  title: <FormattedMessage id="returns.link" />,
  backButton: {
    titleId: "returns.link",
    path: "/my-returns"
  }
};

const StoreMyReturnsDetails = () => {
  return (
    <Route
      path="/my-returns/details/:id"
      exact
      render={(props: any) => (
        <ReturnsDetails {...props} headerConfig={headerConfig} />
      )}
    />
  );
};

export default StoreMyReturnsDetails;
