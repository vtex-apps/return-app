import React from "react";
import { Route } from "react-router-dom";
import { FormattedMessage } from "react-intl";

import ReturnsPageAdd from "./store/MyReturnsPageAdd";

const headerConfig = {
  namespace: "vtex-account__returns-list",
  title: <FormattedMessage id={"returns.link"} />,
  backButton: {
    titleId: "returns.link",
    path: "/my-returns"
  }
};

const StoreMyReturnsPageAdd = () => {
  return (
    <Route
      path="/my-returns/add"
      exact
      render={(props: any) => (
        <ReturnsPageAdd {...props} headerConfig={headerConfig} />
      )}
    />
  );
};

export default StoreMyReturnsPageAdd;
