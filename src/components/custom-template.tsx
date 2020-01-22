import * as React from "react"
import { useState } from "react"
import Form from "react-jsonschema-form"

const ObjectFieldTemplate = props => {
  return (
    <div className="data-table-template">
      <legend>{props.title}</legend>
      {props.description}
      <div className="properties">
        {props.properties.map((element, idx) => <div key={idx} className="property-wrapper">{element.content}</div>)}
      </div>
    </div>
  )
}

const ArrayFieldTemplate = props => {
  return (
    <div>
      <div className="column-header">{props.title}</div>
      {props.items.map((element, idx) => <div key={idx}>{element.children}</div>)}
    </div>
  );
}

const dataTableSchema = {
  title: "Data Table",
  type: "object",
  properties: {
    location: {
      title: "Location",
      type: "array",
      readOnly: true,
      items: {
        type: ["string", "null"]
      }
    },
    temperature: {
      title: "Temperature",
      type: "array",
      items: {
        type: ["null", "number"]
      }
    },
    light: {
      title: "Light",
      type: "array",
      items: {
        type: ["null", "number"]
      }
    },
    humidity: {
      title: "Humidity",
      type: "array",
      items: {
        type: ["null", "number"]
      }
    }
  }
}

const dataTableUiSchema = {
  "ui:ObjectFieldTemplate": ObjectFieldTemplate,
  location: {
    "ui:ArrayFieldTemplate": ArrayFieldTemplate
  },
  temperature: {
    "ui:ArrayFieldTemplate": ArrayFieldTemplate
  },
  light: {
    "ui:ArrayFieldTemplate": ArrayFieldTemplate
  },
  humidity: {
    "ui:ArrayFieldTemplate": ArrayFieldTemplate
  }
}

const dataTableData = {
  location: ["Corner 1", "Corner 2", "Corner 3", "Corner 4", "Center"],
  temperature: [null, null, null, null, null],
  light: [null, null, null, null, null],
  humidity: [null, null, null, null, null]
}

export const CustomTemplate = () => {
  const [result, setResult] = useState<any>(dataTableData)
  const onSubmit = data => setResult(data.formData)
  return (
    <div className="form">
      <legend>Custom Field and Array Templates</legend>
      <Form schema={dataTableSchema} uiSchema={dataTableUiSchema} formData={result} onSubmit={onSubmit}/>
      <pre>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}
