import React, { Component } from "react";

import schemas from "../../masterdata/schema";
import GenerateSchema from "../Components/GenerateSchema";
import ReturnsTableContent from "./ReturnsTableContent";

class ReturnsTable extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      haveSchema: true,
      error: ""
    };
  }

  componentDidMount(): void {
    fetch("/returns/getSchema/" + schemas["schemaEntity"] + "/returnSettings", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => {
        return response.text();
      })
      .then((text: string) => {
        if (text === "") {
          this.setState({ haveSchema: false });
        } else {
          const json = JSON.parse(text);
          if ("error" in json) {
            this.setState({ error: json.error });
          }
        }
      })
      .catch(err => this.setState({ error: err }));
  }

  render() {
    const { haveSchema, error } = this.state;
    if (!haveSchema) {
      return <GenerateSchema />;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return <ReturnsTableContent />;
  }
}

export default ReturnsTable;
