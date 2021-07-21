const {check} = require('express-validator')

const eventValidate = () => {
  return [ 
    check('title', 'Title does not Empty').not().isEmpty(),
    check('startTime', 'Invalid does not Empty').not().isEmpty(),
    check('endTime', 'Invalid does not Empty').not().isEmpty(),
  ]
}
const LoginValidate = () => {
  return [ 
    check('username', 'Username does not Empty').not().isEmpty(),
    check('password', 'Password does not Empty').not().isEmpty(),
  ]
}

const SignUpValidate = () => {
  return [
    check('firstName', 'First name not empty').not().isEmpty(),
    check('lastName', 'Last name not empty').not().isEmpty(),
    check('userName', 'Username not empty').not().isEmpty(),
    check('phoneNumber', 'Phone number not empty').not().isEmpty(),
    check('password', 'Password not empty').not().isEmpty(),
  ]
}

const validate = {
  eventValidate: eventValidate,
  LoginValidate: LoginValidate,
  SignUpValidate: SignUpValidate
}

module.exports = {validate}