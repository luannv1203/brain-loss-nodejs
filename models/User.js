const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: { type: String, require: true},
  lastName: { type: String, require: true},
  userName: { type: String, unique: true, require: true},
  phoneNumber: { type: String, unique: true, require: true},
  password: { type: String, require: true},
  avatar: { type: String },
})

module.exports = mongoose.model('User', userSchema)