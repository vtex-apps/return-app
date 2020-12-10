import React, { FC } from "react";

const GenerateSchema: FC<{}> = () => {
  function generateSchema() {
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
