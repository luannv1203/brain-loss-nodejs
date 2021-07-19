const jwt = require('jsonwebtoken')
const tokenSecret = process.env.API_SECRET_KEY
const bcrypt = require('bcrypt')
const UserModel = require('../models/User')
const UserReponse = require('../responses/User')
var {validationResult} = require('express-validator')

module.exports = {
  login: async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, errors: errors.array(), status: 'Failed', message: 'Bad Request!' })
    }
    var user = await UserModel.findOne({userName: req.body.username})
    if(!user) {
      return res.status(200).json({
        code: 200,
        status: 'Failed',
        message: 'Tài khoản hoặc mật khẩu không đúng!'
      })
    } else {
      let match = bcrypt.compareSync(req.body.password, user.password)
      if(match) {
        return res.status(200).json({
          code: 200,
          status: 'Success',
          message: 'Đăng nhập thành công!',
          data: {token: generateToken(user)}
        })
      } else {
        return res.status(200).json({
          code: 200,
          status: 'Failed',
          message: 'Tài khoản hoặc mật khẩu không đúng!'
        })
      }
    }
  },
  signUp: async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ code: 400, errors: errors.array(), status: 'Failed', message: 'Bad Request!' })
    }
    let data = req.body
    data.password = bcrypt.hashSync(data.password, 10)
    console.log(data)
    const isCreateUser = await UserModel.create(data)
    if(!isCreateUser) {
      return res.status(200).json({
        code: 200,
        status: 'Failed',
        message: 'Sign Up Failed!'
      })
    }
    return res.status(200).json({
      code: 200,
      status: 'Success',
      message: 'Sign Up Success'
    })
  },
  getUserInfo: async (req, res) => {
    const user = UserReponse(req.user)
    return res.status(200).json({
      code: 200,
      status: 'Success',
      data: user
    })
  },
  getListUser: async (req, res) => {
    const users = await UserModel.find({$or: [{ firstName:  {$regex: '.*' + req.query.name + '.*'}}, { lastName:  {$regex: '.*' + req.query.name + '.*'}}]})
    return res.status(200).json({
      code: 200,
      status: 'Success',
      data: users
    })
  }
}
function generateToken(user) {
  return jwt.sign({data: user}, tokenSecret, {expiresIn: '24h'})
}