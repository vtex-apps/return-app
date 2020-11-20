import React from "react";
import { ContentWrapper } from "vtex.my-account-commons";
import { PageProps } from "../typings/utils";

const MyReturnsPageAdd = (props: PageProps) => {
  const { headerConfig } = props;
  return (
    <ContentWrapper {...headerConfig}>
      {() => {
        <div>TEST</div>;
      }}
    </ContentWrapper>
  );
};

export default MyReturnsPageAdd;
