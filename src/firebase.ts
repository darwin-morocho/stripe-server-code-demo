import * as admin from "firebase-admin";

const serviceAccount = require("../firebase-admin-key.json");
const firebaseApp = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://flutter-ui-avanzadas.firebaseio.com",
});

export default firebaseApp;
