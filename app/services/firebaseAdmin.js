var oFirebaseAdmin = require("firebase-admin");
const oServiceAccount = require("../throo-app-push-alarm-firebase-adminsdk-uanaf-1a08f650d2.json");
const oServiceAccountPos = require("../throo-pos-app-firebase-adminsdk-7wuz4-e4ea204823.json");
const oServiceAccountCeo = require("../throo-ceo-firebase-adminsdk-7suim-3b5f8795cc.json");

var oFirebaseAdminAppPos = oFirebaseAdmin.initializeApp(
   {
      credential: oFirebaseAdmin.credential.cert(oServiceAccountPos),
      databaseURL: "https://throo-pos-app.firebaseio.com"
   },
   'first' // this name will be used to retrieve firebase instance. E.g. first.database();
);

var oFirebaseAdminApp = oFirebaseAdmin.initializeApp(
   {
      credential: oFirebaseAdmin.credential.cert(oServiceAccount),
      databaseURL: "https://throo-app-push-alarm.firebaseio.com"
   },
   'second' // this name will be used to retrieve firebase instance. E.g. first.database();
);

var oFirebaseAdminAppCeo = oFirebaseAdmin.initializeApp(
   {
      credential: oFirebaseAdmin.credential.cert(oServiceAccountCeo),
      databaseURL: "https://throo-ceo.firebaseio.com"
   },
   'third' // this name will be used to retrieve firebase instance. E.g. first.database();
);

/*
var _second = admin.initializeApp(
   {
      credential: admin.credential.cert(secondServiceAccount),
      databaseURL: 'https://<2nd-db-name>.firebaseio.com'
   },
   'second' // this name will be used to retrieve firebase instance. E.g. second.database();
);
*/

module.exports = {
   oFirebaseAdminAppPos,
   oFirebaseAdminApp,
   oFirebaseAdminAppCeo
}