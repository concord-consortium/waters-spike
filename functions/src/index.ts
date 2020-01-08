import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

export const saveValue = functions.https.onRequest((request, response) => {
  const {key} = request.query;
  const {value} = request.body;
  if (!key) {
    response.status(400).send("Missing key in query string!");
  } else if (!request.body.hasOwnProperty("value")) {
    response.status(400).send("Missing value in body!");
  } else {
    admin
      .firestore()
      .collection("values")
      .doc(key)
      .set({value})
      .then(() => {
        response.status(200).send("Value saved");
      })
      .catch((err) => {
        response.status(500).send(err.toString());
      })
  }
});