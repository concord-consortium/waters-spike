import * as React from "react"
import { useState } from "react"
import { Scanner } from "./scanner"

export enum UploadState {
  NotScanning,
  Scanning,
  Uploading,
  UploadFailed,
  Uploaded
}

interface Props {
  data: any;
  onStateChange: (state: UploadState, err?: any) => void
}

export const Uploader = (props: Props) => {
  const [uploadState, setUploadState] = useState<UploadState>(UploadState.NotScanning)
  const [uploadError, setUploadError] = useState();

  const changeState = (newState: UploadState, err?: any) => {
    setUploadState(newState)
    setUploadError(err)
    props.onStateChange(newState, err)
  }

  const handleOnScanned = (url: string) => {
    changeState(UploadState.Uploading);
    fetch(url, {method: "POST", body: JSON.stringify(props.data)})
      .then((resp) => {
        if (resp.status === 200) {
          changeState(UploadState.Uploaded)
        } else {
          resp.text().then((text) => changeState(UploadState.UploadFailed, text))
        }
      })
      .catch((err) => {
        changeState(UploadState.UploadFailed, err)
      })
  }

  const contents = () => {
    const button = (label: string) => <button onClick={() => changeState(UploadState.Scanning)}>{label}</button>

    switch (uploadState) {
      case UploadState.NotScanning:
        return button("Upload using QR Code")

      case UploadState.Scanning:
        return (
          <>
            <Scanner onScanned={handleOnScanned} />
            <div>
              <button onClick={() => changeState(UploadState.NotScanning)}>Cancel Upload</button>
            </div>
          </>
        )

      case UploadState.Uploading:
        return (
          <div>⌛ Uploading data...</div>
        )

      case UploadState.UploadFailed:
        return (
          <>
            <div className="error">Upload failed!</div>
            <div>{uploadError ? uploadError.toString() : "No error info available!"}</div>
            {button("Try again...")}
          </>
        )

      case UploadState.Uploaded:
        return (
          <>
            <div>Data uploaded!</div>
            {button("Upload again...")}
          </>
        )
    }
  }

  return (
    <div className="uploader">
      {contents()}
    </div>
  )
}