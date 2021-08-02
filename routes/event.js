var express = require('express')
var router = express.Router()
const { validate } = require('../middleware/Validate')
const event = require('../controllers/event')
const middleware = require('../middleware')

router.get('', middleware.verifyToken, event.getAllEvent)
router.get('/invited', middleware.verifyToken, event.getEventInvited)
router.post('', middleware.verifyToken, validate.eventValidate(), event.createEvent)
router.put('/:eventId', middleware.verifyToken, validate.eventValidate(), event.editEvent)
router.get('/:eventId', middleware.verifyToken, event.getEventById)
router.delete('/:eventId', middleware.verifyToken, event.deleteEventById)
router.put('/confirm/:eventId', middleware.verifyToken, event.confirmEvent)
module.exports = router
