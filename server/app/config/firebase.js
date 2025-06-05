const admin = require('firebase-admin');
const serviceAccount = require('../../serviceAccountKey.json');

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://portfolio-portal-b0fa3-default-rtdb.europe-west1.firebasedatabase.app/"
  });
}

const db = admin.database();

module.exports = { admin, db };