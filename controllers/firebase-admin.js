//Firebase Admin
const serviceAccount = require('../firebase-admin/brain-loss-firebase-adminsdk-yjb70-9d15d25df0.json')
const admin = require("firebase-admin");
const NotificationModel = require('../models/Notification')
const { ObjectID } = require("mongodb")
var { validationResult } = require("express-validator");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://brain-loss-default-rtdb.firebaseio.com'
});
module.exports = {
  registerToken: async (req, res) => {
    const errors = validationResult(req);
    let check = NotificationModel.aggregate([
      {
        $match: {
          'deviceID': req.body.deviceID
        }
      }
    ])
    let data = req.body
    data.user_id = req.user._id
    console.log('data', data)
    if(!check) {
      let result = await NotificationModel.create(data)
      if(!result) {
        res.status(200).json({ message: "Register FCM Token Failed!" });
      }
    } else {
      await NotificationModel.find({
        'deviceID': data.deviceID
      }).updateOne(data)
    }
    res.status(200).json({ message: "Successfully registered FCM Token!" });
  },

  notifications: async (notification, tokens) => {
    try {
      let rs = await admin.messaging().sendMulticast({
        tokens: tokens,
        notification: notification
      });
    } catch (err) {
      console.log(err)
    }
  }
};
//
