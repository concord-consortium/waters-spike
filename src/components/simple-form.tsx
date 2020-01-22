import * as React from "react"
import Form from "react-jsonschema-form"
import { useState } from "react";

const labelTabSchema = {
  title: "Simple Form",
  type: "object",
  required: ["studySite", "label"],
  properties: {
    studySite: {
      title: "Study Site",
      type: "string",
      default: "site1",
      enum: [
        "site1",
        "site2"
      ],
      enumNames: [
        "Site @1",
        "Site @2"
      ]
    },
    label: {
      type: "string",
    },
    groupMembers: {
      type: "string"
    }
  }
}

const labelUiSchema = {
  sensor: {
    "ui:field": "sensorComponent"
  },
  studySite: {
    "ui:options": {
      label: false
    }
  },
  label: {
    "ui:placeholder": "My Experiment 1",
    "ui:options": {
      label: false
    }
  },
  groupMembers: {
    "ui:placeholder": "Group Team Members",
    "ui:options": {
      label: false
    }
  }
}

export const SimpleForm = () => {
  const [result, setResult] = useState<any>({})
  const onSubmit = data => setResult(data.formData)
  return (
    <div className="form">
      <Form schema={labelTabSchema} uiSchema={labelUiSchema} onSubmit={onSubmit}/>
      <pre>
        { JSON.stringify(result, null, 2) }
      </pre>
    </div>
  )
}
