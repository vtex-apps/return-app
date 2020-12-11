import React, { Component, useState } from "react";

class ReturnsTableContent extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      returns: [],
      error: ""
    };
  }

  componentDidMount(): void {
    fetch("/returns/getDocuments/returnRequests", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.json())
      .then(returns => {
        this.setState({ returns: returns });
      })
      .catch(err => this.setState({ error: err }));
  }

  render() {
    const { error, returns } = this.state;

    if (error) {
      return (
        <div>
          <p className={`center`}>{error}</p>
        </div>
      );
    }

    if (returns.length) {
      return <div>Table</div>;
    } else {
      return <div>There are no return requests</div>;
    }
  }
}

export default ReturnsTableContent;
