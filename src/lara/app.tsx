import * as React from "react"
import { useState, useRef, useEffect } from "react"
import QRCode from "qrcode-svg"
import iframePhone from "iframe-phone"
import { Base64 } from "js-base64"
import * as firebase from "firebase/app"
import "firebase/firestore"

// NOTE: this is only a partial description of the returned data, containing only the fields we are interested in
interface InitInteractiveData {
  classInfoUrl: string;
  interactiveStateUrl: string;
  interactive: {
    id: number
  };
  authInfo: {
    email: string
  };
  pageNumber: number;
  activityName: string;
}

interface FirebaseValue {
  value: number;
}

let inIframe = false
try {
  inIframe = window.top !== window.self
} catch (e) {
  inIframe = true
}

export const App = () => {
  const urlRef = useRef<HTMLTextAreaElement>()
  const [value, setValue] = useState<number|undefined>()
  const [qrCode, setQRCode] = useState("")
  const [connectedToLara, setConnectedToLara] = useState(false)
  const [connectedToFirebase, setConnectedToFirebase] = useState(false)
  const [initInteractiveData, setInitInteractiveData] = useState<InitInteractiveData | undefined>(undefined)
  const [error, setError] = useState<any>()

  const generateQRCode = (url: string) => {
    const svg = new QRCode({
      content: url,
      width: 400,
      height: 400,
    }).svg()
    setQRCode(svg)
  }

  const handleUrlChange = () => {
    if (urlRef.current) {
      const url = urlRef.current.value
      generateQRCode(url)
    }
  }

  const renderInIframe = () => {
    if (!connectedToLara) {
      return <div>⌛ Waiting to connect to LARA ...</div>
    }

    if (!initInteractiveData) {
      return undefined;
    }

    if (!connectedToFirebase) {
      return <div>⌛ Waiting to connect to Firebase ...</div>
    }

    return (
      <>
        <div className="value">
          {value === undefined ? "Value not yet set ..." : value}
        </div>
      </>
    )
  }

  const renderOutsideIframe = () => {
    return (
      <>
        <div className="note">
          For testing outside of a LARA interactive you can manually set the url for the QR code for the mobile app.
        </div>
        <div className="uploadUrl">
          <textarea ref={urlRef} onChange={handleUrlChange} placeholder="Enter URL for QR Code" />
        </div>
      </>
    )
  }

  if (inIframe) {
    useEffect(() => {
      // create iframephone and wait for initInteractive
      const phone = iframePhone.getIFrameEndpoint()
      phone.addListener("initInteractive", (initInteractiveData: InitInteractiveData) => {

        setConnectedToLara(true)

        const {classInfoUrl, interactiveStateUrl, interactive, pageNumber, activityName} = initInteractiveData
        const email = initInteractiveData.authInfo ? initInteractiveData.authInfo.email : ""

        if (!interactiveStateUrl){
          setError("No preview available ...")
          return
        }

        setInitInteractiveData(initInteractiveData)

        // connect to Firebase after initInteractive
        firebase.initializeApp({
          apiKey: atob("QUl6YVN5Q1pqZWUxWE5qNk5acUZ2dXlvSWE5R0ZCV2dGSDd2QWpZ"),
          authDomain: "waters-spike.firebaseapp.com",
          databaseURL: "https://waters-spike.firebaseio.com",
          projectId: "waters-spike",
          storageBucket: "waters-spike.appspot.com",
          messagingSenderId: "623606198690",
          appId: "1:623606198690:web:a38326974b102ef1c902fb"
        });

        // skip signing in with the user's jwt for this spike app

        // generate key for interactive
        const key = Base64.encode(interactiveStateUrl)

        // listen to doc at key for value
        firebase
          .firestore()
          .collection("values")
          .doc(key)
          .onSnapshot(snapshot => {
            const firebaseData = snapshot.data() as FirebaseValue | undefined
            setValue(firebaseData ? firebaseData.value : undefined)
            setConnectedToFirebase(true)

            // create the base64 encoded extra data to save with the value
            const extraData = Base64.encode(JSON.stringify({
              classInfoUrl,
              interactiveId: interactive.id,
              pageNumber,
              activityName,
              email
            }))

            // generate url for key
            const url = `https://us-central1-waters-spike.cloudfunctions.net/saveValue?key=${key}&extraData=${extraData}`

            // set QR code for url
            generateQRCode(url)

          }, (err) => {
            setError(err)
          });
      })

      phone.initialize();

      phone.post("supportedFeatures", {
        apiVersion: 1,
        features: {
          interactiveState: false,
        }
      });

    }, [])
  }

  return (
    <div className="app">
      <div className="header">
        WATERS Spike LARA App
      </div>
      {inIframe ? renderInIframe() : renderOutsideIframe() }
      {error  ? <div className="error">{error.toString()}</div>    : undefined}
      {qrCode ? <div dangerouslySetInnerHTML={{__html: qrCode}} /> : undefined}
    </div>
  )
}