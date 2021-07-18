var express = require('express')
var router = express.Router()
const { validate } = require('../middleware/Validate')
const user = require('../controllers/user')
const middleware = require('../middleware')

router.get('/get-info', middleware.verifyToken, user.getUserInfo)
module.exports = router
