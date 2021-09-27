import * as admin from "firebase-admin";

const serviceKey = require("./account-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceKey as any),
  databaseURL: "https://apx-m6-ba08c-default-rtdb.firebaseio.com",
});

const firestore = admin.firestore();
const realTime = admin.database();
export { firestore, realTime };
