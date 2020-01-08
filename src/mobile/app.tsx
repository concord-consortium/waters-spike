import * as React from "react"
import { Range } from "react-range"
import { useState } from "react"
import { Uploader, UploadState } from "./uploader"

export const App = () => {
  const [values, setValues] = useState<number[]>([50])
  const [showSlider, setShowSlider] = useState(true)

  return (
    <div className="app">
      <div className="header">
        WATERS Spike Mobile App
      </div>
      {showSlider ?
        <>
          <div className="value">
            {values[0]}
          </div>
          <div className="slider">
            <div>
              <Range
                step={1}
                min={0}
                max={100}
                values={values}
                onChange={values => setValues(values)}
                renderTrack={({ props, children }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '6px',
                      width: '100%',
                      backgroundColor: '#ccc'
                    }}
                  >
                    {children}
                  </div>
                )}
                renderThumb={({ props }) => (
                  <div
                    {...props}
                    style={{
                      ...props.style,
                      height: '42px',
                      width: '42px',
                      backgroundColor: '#999'
                    }}
                  />
                )}
              />
            </div>
          </div>
        </>
        : undefined
      }
      <Uploader
        data={{value: values[0]}}
        onStateChange={(uploaderState) => setShowSlider(uploaderState !== UploadState.Scanning)}
      />
    </div>
  )
}