import * as React from "react"
import { CustomField } from "./custom-field"
import { SimpleForm } from "./simple-form"

export const App = () => {
  const onSubmit = data => console.log(data)
  return (
    <div className="app">
      <SimpleForm/>
      <CustomField/>
    </div>
  )
}
