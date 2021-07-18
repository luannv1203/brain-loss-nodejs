const EventModel = require('../models/Event')
const Utils = require('../utils')
var {validationResult} = require('express-validator')
var ModelResponseEvent = require('../responses/Event')
const moment = require('moment')

module.exports = {
  getAllEvent: async (req, res) => {
    let result = {}
    var events = await EventModel.find({}).sort({startTime: 1})
    events.forEach(event => {
      event = ModelResponseEvent(event)
      var key = moment(event.startTime).format('YYYY-MM-DD')
      if(result[key]) {
        result[key].push(event)
      } else {
        result[key] = []
        result[key].push(event)
      }
    })
    setTimeout(() => {
      res.status(200).json({
        code: 200,
        status: 'Success',
        data: result
      })
    }, 1000)
  },
  getListEvent: async (req, res) => {
    if(req.query.title) {
      let events = await EventModel.find({ title:  {$regex: '.*' + req.query.title + '.*'} })
      return res.status(200).json({
        code: 200,
        status: 'Success',
        data: events
      })
    } else {
      return res.status(200).json({
        code: 200,
        status: 'Success',
        data: []
      })
    }
  },
  createEvent: async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      res.status(400).json({ code: 400, errors: errors.array(), status: 'Failed', message: 'Bad Request!' })
      return;
    }
    const isCreateEvent = await EventModel.create(req.body)
    if (!isCreateEvent) {
      return res.status(200).json({
        code: 200, status: 'Fail', message: 'Create event failed!'
      })
    }

    return res.status(200).json({
      code: 200, status: 'Success', message: 'Create event success!'
    })
  },
  getEventById: async (req, res) => {
    if (!req.params.eventId) {
      return res.status(400).json({
        code: 400,
        status: 'Failed',
        message: 'Missing params'
      })
    }
    let response = await EventModel.findById(req.params.eventId)
    if (!response) {
      return res.status(200).json({
        code: 200,
        status: 'Success',
        message: 'Event Not Found!'
      })
    }
    return res.status(200).json({
      code: 200,
      status: 'Success',
      data: response
    })
  },
  editEvent: async (req, res) => {
    if (!req.params.eventId) {
      return res.status(400).json({
        code: 400,
        status: 'Failed',
        message: 'Missing params'
      })
    }
    const errors = validationResult(req)
    if(!errors.isEmpty) {
      res.status(400).json({ code: 400, error: errors.array(), status: 'Failed', message: 'Bad Request!'})
    }

    let result = await EventModel.findById(req.params.eventId)
    if(!result) {
      return res.status(200).json({
        code: 200,
        status: 'Failed',
        message: 'Event not found!'
      })
    } else {
      let response = await EventModel.findById(req.params.eventId).updateOne(req.body)
      if (!response) {
        return res.status(200).json({
          code: 200,
          status: 'Failed',
          message: 'Update Event Failed'
        })
      }
      return res.status(200).json({
        code: 200,
        status: 'Success',
        message: 'Update Success!'
      })
    }
  },
  deleteEventById: async (req, res) => {
    if(!req.params.eventId) {
      return res.status(200).json({
        code: 200,
        status: 'Failed',
        message: 'Missing Params'
      })
    }
    let result = await EventModel.findByIdAndDelete(req.params.eventId)
    if(!result) {
      return res.status(200).json({
        code: 200,
        status: 'Failed',
        message: 'Delete Event Failed'
      })
    }
    return res.status(200).json({
      code: 200,
      status: 'Success',
      message: 'Delete Event Success'
    })
  }
}