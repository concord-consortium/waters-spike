import * as React from "react"
import { useState, useRef } from "react"
import QRCode from "qrcode-svg"

export const App = () => {
  const [value, setValue] = useState<number|undefined>()
  const [qrCode, setQRCode] = useState("")
  const urlRef = useRef<HTMLTextAreaElement>()

  const handleUrlChange = () => {
    if (urlRef.current) {
      const url = urlRef.current.value;
      const svg = new QRCode(url).svg();
      setQRCode(svg)
    }
  }

  return (
    <div className="app">
      <div className="header">
        WATERS Spike LARA App
      </div>
      <div className="note">
        For now we are just generating a QR code for the mobile app.
      </div>
      <div className="uploadUrl">
        <textarea ref={urlRef} onChange={handleUrlChange} placeholder="Enter URL for QR Code" />
      </div>
      {qrCode ? <div dangerouslySetInnerHTML={{__html: qrCode}} /> : undefined}
    </div>
  )
}