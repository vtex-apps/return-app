import React, { FC } from "react";
import { omsReturnRequest } from '../../common/templates/oms-return-request'

const GenerateSchema: FC<{}> = () => {
  function generateSchema() {

      fetch("/api/template-render/pvt/templates", {
          method: "POST",
          body: JSON.stringify({
              "Name": "oms-return-request",
              "FriendlyName": "[OMS] Return Request",
              "Description": null,
              "IsDefaultTemplate": false,
              "AccountId": null,
              "AccountName": null,
              "ApplicationId": null,
              "IsPersisted": true,
              "IsRemoved": false,
              "Type": "",
              "Templates": {
                  "email": {
                      "To": "{{data.email}}",
                      "CC": null,
                      "BCC": "{{#compare data.status \"==\" 'New'}}{{/compare}}",
                      "Subject": "Formular de returnare {{data.DocumentId}}",
                      "Message": omsReturnRequest,
                      "Type": "E",
                      "ProviderId": "00000000-0000-0000-0000-000000000000",
                      "ProviderName": null,
                      "IsActive": true,
                      "withError": false
                  },
                  "sms": {
                      "Type": "S",
                      "ProviderId": null,
                      "ProviderName": null,
                      "IsActive": false,
                      "withError": false,
                      "Parameters": []
                  }
              }
          }),
          headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
          }
      });

    fetch("/returns/generateSchema/", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      }
    })
      .then(response => response.text())
      .then(json => console.log(json))
      .catch(err => console.log(err));
  }

  return (
    <div className={`flex flex-column justify-center`}>
      <p className={`center`}>Masterdata schema missing.</p>
      <button
        onClick={() => {
          generateSchema();
        }}
      >
        Generate Schema
      </button>
    </div>
  );
};

export default GenerateSchema;
