const mongoose = require('mongoose')
const Schema = mongoose.Schema

const paticipantSchema = new Schema({
  event_id: {type: Schema.Types.ObjectId, ref: 'Event'},
  user_id:  [{type: Schema.Types.ObjectId, ref: 'User'}],
  confirm: {type: Boolean}
})

module.exports = mongoose.model('Paticipants', paticipantSchema)