const mongoose = require('mongoose')
const Schema = mongoose.Schema

const eventSchema = new Schema({
  title: { type: String, require: true },
  isAllDay: { type: Boolean },
  startTime: { type: Number, require: true },
  endTime: { type: Number, require: true },
  user_id: {type: Schema.Types.ObjectId, require: true, ref: 'User'},
  location: { type: String },
  note: { type: String },
  notification: { type: Number },
  tag: {type: String}
})

module.exports = mongoose.model('Event', eventSchema)