const express = require('express')
const rootRouter = express.Router()

const auth = require('./auth')
const user = require('./user')
const event = require('./event')

rootRouter.use('/auth', auth)
rootRouter.use('/event', event)
rootRouter.use('/user', user)

module.exports = rootRouter