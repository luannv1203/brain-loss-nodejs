const mongoose = require('mongoose')
const Schema = mongoose.Schema

const NotificationSchema = new Schema({
  user_id: {type: Schema.Types.ObjectId, require: true, ref: 'User'},
  deviceID: {type: String, require: true},
  token: {type: String, require: true}
})
module.exports = mongoose.model('Notification', NotificationSchema)
