import * as React from "react"
import { useState } from "react"
import Form from "react-jsonschema-form"

const getNumRows = formData =>
  Math.max.apply(null, Object.keys(formData).map(propName => formData && formData[propName].length || 0))

const castToSpecificTypes = (formData, properties) => {
  const result = {}
  Object.keys(properties).map(propName => {
    const type = properties[propName].items.type
    result[propName] = []
    for (let value of formData[propName] || []) {
      if ((type === "number" || type.indexOf("number") !== -1) && Number(value)) {
        result[propName].push(Number(value))
      } else if ((type === "null" || type.indexOf("null") !== -1)  && (value === "null" || value === null || value === undefined)) {
        result[propName].push(null)
      } else {
        result[propName].push(value)
      }
    }
  })
  console.log(result)
  return result
}

const DataTableField = (props) => {
  const [formData, setFormData] = useState<any>(props.formData)
  const properties = props.schema.properties
  const propNames = Object.keys(properties)
  const numRows = getNumRows(formData)

  const handleInputChange = (propName, idx, event) => {
    const newFormData = Object.assign({}, formData)
    if (!newFormData[propName]) {
      newFormData[propName] = []
    }
    newFormData[propName][idx] = event.target.value
    setFormData(newFormData)
    props.onChange(castToSpecificTypes(newFormData, properties))
  }

  return (
    <div className="data-table-field">
      <table>
        <tbody>
        <tr>
          { propNames.map(propName => <th key={propName}>{ properties[propName].title }</th>) }
        </tr>
        {
          Array.from(new Array(numRows)).map((_, idx) =>
            <tr key={idx}>
              {
                propNames.map(propName =>
                  <td key={propName}>
                    <input type="text" value={ formData[propName] && formData[propName][idx] || "" } onChange={event => handleInputChange(propName, idx, event)}/>
                  </td>)
              }
            </tr>
          )
        }
        </tbody>
      </table>
    </div>
  )
}

const dataTableSchema = {
  title: "Data Table",
  type: "object",
  properties: {
    location: {
      title: "Location",
      type: "array",
      items: {
        type: "string"
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
        type: "string"
      }
    }
  }
}

const dataTableUiSchema = {
  "ui:field": "dataTable"
}

const fields = { dataTable: DataTableField }

const dataTableData = {
  location: [ "Corner 1", "Corner 2", "Corner 3", "Corner 4", "Center" ]
}


export const CustomField = () => {
  const [result, setResult] = useState<any>(dataTableData)
  const onSubmit = data => setResult(data.formData)
  return (
    <div className="form">
      <legend>Custom Data Table Field</legend>
      <Form schema={dataTableSchema} uiSchema={dataTableUiSchema} fields={fields} formData={dataTableData} onSubmit={onSubmit}/>
      <pre>
        { JSON.stringify(result, null, 2) }
      </pre>
    </div>
  )
}
