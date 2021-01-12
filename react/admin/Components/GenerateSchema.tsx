import React, { FC } from "react";
import { fetchHeaders, fetchMethod, fetchPath } from "../../common/fetch";
import { FormattedMessageFixed } from "../../common/utils";

const GenerateSchema: FC<{}> = () => {
  function generateSchema() {
    fetch(fetchPath.generateSchema, {
      method: fetchMethod.put,
      headers: fetchHeaders
    })
      .then(response => response.text())
      .then(json => console.log(json))
      .catch(err => console.log(err));
  }

  return (
    <div className={`flex flex-column justify-center`}>
      <p className={`center`}>
        <FormattedMessageFixed id={"admin/returns.schemaMissing"} />
      </p>
      <button
        onClick={() => {
          generateSchema();
        }}
      >
        <FormattedMessageFixed id={"admin/returns.generateSchema"} />
      </button>
    </div>
  );
};

export default GenerateSchema;
