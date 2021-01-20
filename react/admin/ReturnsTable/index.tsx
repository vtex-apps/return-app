import React, { Component } from "react";

import ReturnsTableContent from "./ReturnsTableContent";
import { fetchHeaders, fetchMethod, fetchPath } from "../../common/fetch";
import { omsReturnRequest } from "../../common/templates/oms-return-request";

class ReturnsTable extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: ""
    };
  }

  componentDidMount(): void {
    fetch(fetchPath.getSchema, {
      method: fetchMethod.get,
      headers: fetchHeaders
    })
      .then(response => {
        return response.text();
      })
      .then((text: string) => {
        if (text === "") {
          fetch(fetchPath.renderTemplates, {
            method: fetchMethod.post,
            body: JSON.stringify({
              Name: "oms-return-request",
              FriendlyName: "[OMS] Return Request",
              Description: null,
              IsDefaultTemplate: false,
              AccountId: null,
              AccountName: null,
              ApplicationId: null,
              IsPersisted: true,
              IsRemoved: false,
              Type: "",
              Templates: {
                email: {
                  To: "{{data.email}}",
                  CC: null,
                  BCC: "{{#compare data.status \"==\" 'New'}}{{/compare}}",
                  Subject: "Formular de returnare {{data.DocumentId}}",
                  Message: omsReturnRequest,
                  Type: "E",
                  ProviderId: "00000000-0000-0000-0000-000000000000",
                  ProviderName: null,
                  IsActive: true,
                  withError: false
                },
                sms: {
                  Type: "S",
                  ProviderId: null,
                  ProviderName: null,
                  IsActive: false,
                  withError: false,
                  Parameters: []
                }
              }
            }),
            headers: fetchHeaders
          });

          fetch(fetchPath.generateSchema, {
            method: fetchMethod.post,
            headers: fetchHeaders
          })
            .then(response => response.text())
            .then(json => console.log(json))
            .catch(err => this.setState({ error: err }));
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
    const { error } = this.state;
    if (error) {
      return <div>{error}</div>;
    }

    return <ReturnsTableContent />;
  }
}

export default ReturnsTable;
