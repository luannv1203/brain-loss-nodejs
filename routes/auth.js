var express = require('express')
var router = express.Router()
const { validate } = require('../middleware/Validate')
const user = require('../controllers/user')
const firebase = require('../controllers/firebase-admin')
const middleware = require('../middleware')

router.post('/login', validate.LoginValidate(), user.login)
router.post('/sign-up', validate.SignUpValidate(), user.signUp)
router.post('/register-firebase-token', middleware.verifyToken, validate.RegisterTokenValidate(),firebase.registerToken)
router.post('/send-notifications', middleware.verifyToken, validate.SendNotificationnValidate(),firebase.notifications)
module.exports = router
