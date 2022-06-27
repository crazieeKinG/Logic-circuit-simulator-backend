const firebase = require("firebase-admin");
const serviceAccount = require("./logic-circuit-simulator-b3ef2-firebase-adminsdk-swqei-6325a175fc.json");

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount)
});

const db = firebase.firestore();

module.exports = db;