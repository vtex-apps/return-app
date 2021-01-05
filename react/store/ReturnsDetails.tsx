import React, { Component } from "react";
import { ContentWrapper } from "vtex.my-account-commons";

import { PageProps } from "../typings/utils";

class ReturnsDetails extends Component<PageProps> {
  constructor(props: PageProps) {
    super(props);
    this.state = {};
  }
  async getProfile() {
    return await fetch("/no-cache/profileSystem/getProfile")
      .then(response => response.json())
      .then(response => {
        if (response.IsUserDefined) {
          this.setState({
            userId: response.UserId,
            name:
              response.FirstName && response.LastName
                ? response.FirstName + " " + response.LastName
                : "",
            email: response.Email
          });
        }
        return Promise.resolve(response);
      });
  }

  componentDidMount(): void {
    const returnId = this.props["match"]["params"]["id"];
  }

  render() {
    return (
      <ContentWrapper {...this.props.headerConfig}>
        {() => {
          return (
            <div>
              <p>TEST</p>
            </div>
          );
        }}
      </ContentWrapper>
    );
  }
}

export default ReturnsDetails;
