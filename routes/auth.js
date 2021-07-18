var express = require('express')
var router = express.Router()
const { validate } = require('../middleware/Validate')
const user = require('../controllers/user')

router.post('/login', validate.LoginValidate(), user.login)
router.post('/sign-up', validate.SignUpValidate(), user.signUp)
module.exports = router
