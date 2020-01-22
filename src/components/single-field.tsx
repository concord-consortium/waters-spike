import * as React from "react"
import Form from "react-jsonschema-form"
import { useState } from "react";

const schema = {
  title: "Single Field",
  type: "number"
}

const uiSchema = {
  "ui:placeholder": "Experiment Number",
  "ui:options": {
    label: false
  }
}

export const SingleField = () => {
  const [result, setResult] = useState<any>({})
  const onSubmit = data => setResult(data.formData)
  return (
    <div className="form">
      <legend>Single Field Form</legend>
      <Form schema={schema} uiSchema={uiSchema} onSubmit={onSubmit}/>
      <pre>
        {JSON.stringify(result, null, 2)}
      </pre>
    </div>
  )
}
