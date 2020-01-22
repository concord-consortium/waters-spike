import * as React from "react"
import { CustomField } from "./custom-field"
import { SingleField } from "./single-field"
import { SimpleForm } from "./simple-form"
import { CustomTemplate } from "./custom-template"
import { CustomFieldFormFields } from "./custom-field-form-fields"

export const App = () => {
  return (
    <div className="app">
      <SingleField/>
      <SimpleForm/>
      <CustomField/>
      <CustomFieldFormFields/>
      <CustomTemplate/>
    </div>
  )
}
