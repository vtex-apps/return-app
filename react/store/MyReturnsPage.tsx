import React from "react";
import { ContentWrapper } from "vtex.my-account-commons";
import { EmptyState } from "vtex.styleguide";
import { FormattedMessage } from "react-intl";

import { PageProps } from "../typings/utils";
import extraProps from "../extra/extraProps";

const MyReturnsPage = (props: PageProps) => {
  const { returnsList, headerConfig } = props;

  return (
    <ContentWrapper {...headerConfig}>
      {() => {
        let jsx;

        // eslint-disable-next-line prettier/prettier
            if (returnsList?.length) {
          jsx = returnsList.map((returnId: string) =>
            // eslint-disable-next-line no-console
            console.log(returnId)
          );
        } else {
          jsx = [
            <EmptyState key="empty-state" title="">
              <p>
                <FormattedMessage id="store/my-returns.no_returns" />
              </p>
            </EmptyState>
          ];
        }
        return (
          <div className="flex-ns flex-wrap-ns items-start-ns relative tl">
            {jsx}
          </div>
        );
      }}
    </ContentWrapper>
  );
};

export default extraProps(MyReturnsPage);
