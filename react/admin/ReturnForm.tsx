import React, { Component } from "react";
import PropTypes from "prop-types";

export default class ReturnForm extends Component<{}, any> {
  static propTypes = {
    data: PropTypes.object,
    intl: PropTypes.object
  };

  constructor(props: any) {
    super(props);
    this.state = {};
  }

  componentDidMount(): void {
    const requestId = this.props["data"]["params"]["id"];
    console.log(requestId);
  }

  render() {
    return <div>Test</div>;
  }
}
