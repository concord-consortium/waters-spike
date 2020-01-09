import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import * as cors from "cors";
import { Base64 } from "js-base64"

admin.initializeApp(functions.config().firebase);
admin.firestore().settings({
  timestampsInSnapshots: true   // this removes a deprecation warning
});

const corsHandler = cors({origin: true});

export const saveValue = functions.https.onRequest((request, response) => {
  corsHandler(request, response, () => {
    const {key, extraData} = request.query;
    const {value} = request.body;
    if (!key) {
      response.status(400).send("Missing key in query string!");
    } else if (!extraData) {
      response.status(400).send("Missing extraData in query string!");
    } else if (!request.body.hasOwnProperty("value")) {
      response.status(400).send("Missing value in body!");
    } else {
      let data: any = {value}
      try {
        const extraDataJSON = JSON.parse(Base64.decode(extraData))
        data = {
          ...extraDataJSON,
          ...data
        }
      } catch (err){
        response.status(500).send(`Error decoding extraData: ${err.toString()}`)
        return
      }

      admin
        .firestore()
        .collection("values")
        .doc(key)
        .set(data)
        .then(() => {
          response.status(200).send("Value saved");
        })
        .catch((err) => {
          response.status(500).send(err.toString());
        })
    }
  });
});