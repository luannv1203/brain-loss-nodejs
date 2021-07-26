//Firebase Admin
const serviceAccount = require('../firebase-admin/brain-loss-firebase-adminsdk-yjb70-9d15d25df0.json')
const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://brain-loss-default-rtdb.firebaseio.com'
});
var tokens = ["cybaQezNDUEYoQKTN_fnoJ:APA91bH8DdqdhoAjN8eDhCCJM_WnSJLPgYueP0D2LcpF2gF9xOej65AcaodQBEGqk4lHaNZALZPmHQ_SL9UgBMYW3CXzP7T_0wC39hmHAEL5iXg7cGPv2l-HbDA5VOGlv2XGD8cHusfT"];
module.exports = {
  registerToken: async (req, res) => {
    tokens.push(req.body.token);
    res.status(200).json({ message: "Successfully registered FCM Token!" });
  },

  notifications: async (req, res) => {
    try {
      const { title, body } = req.body;
      let rs = await admin.messaging().sendMulticast({
        tokens,
        notification: {
          title,
          body,
        },
      });
      console.log(rs)
      res.status(200).json({ message: "Successfully sent notifications!" })
    } catch (err) {
      console.log(err)
      res.status(err.status).json({ message: err.message })
    }
  }
};
//
