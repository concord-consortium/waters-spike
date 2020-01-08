import * as React from "react"
import { useState } from "react"
import { Scanner } from "./scanner"

enum UploadState {
  NotScanning,
  Scanning,
  Uploading,
  UploadFailed,
  Uploaded
}

interface Props {
  data: any
}

export const Uploader = (props: Props) => {
  const [uploadState, setUploadState] = useState<UploadState>(UploadState.NotScanning)

  const handleOnScanned = (url: string) => {
    setUploadState(UploadState.Uploading);
    fetch(url, {method: "POST", body: props.data})
      .then((resp) => {
        const ok = resp.status === 200
        setUploadState(ok ? UploadState.Uploaded : UploadState.UploadFailed)
      })
      .catch(() => {
        setUploadState(UploadState.UploadFailed)
      })
  }

  const contents = () => {
    const button = (label: string) => <button onClick={() => setUploadState(UploadState.Scanning)}>{label}</button>

    switch (uploadState) {
      case UploadState.NotScanning:
        return button("Upload using QR Code")

      case UploadState.Scanning:
        return (
          <>
            <Scanner onScanned={handleOnScanned} />
            <button onClick={() => setUploadState(UploadState.NotScanning)}>Cancel Upload</button>
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