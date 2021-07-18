const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  userName: { type: String, unique: true},
  phoneNumber: { type: String, unique: true},
  password: { type: String },
  avatar: { type: String }
})

module.exports = mongoose.model('User', userSchema)