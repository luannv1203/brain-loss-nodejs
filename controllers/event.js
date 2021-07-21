const EventModel = require("../models/Event");
const PaticipantModel = require("../models/Paticipant");
const UserModel = require("../models/User")
const Utils = require("../utils");
var { validationResult } = require("express-validator");
var ModelResponseEvent = require("../responses/Event");
const moment = require("moment");
const { ObjectID } = require("mongodb");

module.exports = {
  getAllEvent: async (req, res) => {
    var eventConfirm = await PaticipantModel.aggregate([
      { $match: {
        $and: [
          {'confirm': { $gte: true }}, 
          {'user_id': ObjectID(req.user._id)}
        ]
      }},
      { $group: {
        _id: "$_id",
        "user_id": {"$first": "$user_id"},
        events_id: { $push:  "$event_id" },
        'confirm': { "$first": "$confirm" }
      }},
      {
        $lookup: {
          from: 'events',
          localField: 'events_id',
          foreignField: '_id',
          as: 'events',
        }
      },
      {
        $lookup: {
          from: 'paticipants',
          localField: 'events_id',
          foreignField: 'event_id',
          as: 'participants'
        }
      }
    ])
    var items = []
    eventConfirm.forEach(async (item) => {
      var itemEvent = item.events[0]
      itemEvent.participants = item.participants
    })
    eventConfirm.forEach(item => {
      items = items.concat(item.events)
    })
    var events = await EventModel.aggregate([
      { $match: {
        $and: [
          {'user_id': ObjectID(req.user._id)}
        ]
      }},
      {
        $lookup: {
          from: "paticipants",
          localField: "_id",
          foreignField: "event_id",
          as: "participants",
        },
      }
    ]).sort({startTime: 1})

    
    let result = {}
    events = events.concat(items)
    events.forEach(async (event) => {
      var hihi = []
      event.participants.forEach(async (part) => {
        const info = await UserModel.findById(part.user_id)
        part = {...part, ...{firstName: info.firstName, lastName: info.lastName, avatar: info.avatar}}
        hihi.push(part)
      })
      event.participants = hihi
    })
    if (req.query.title) {
      const sss =  events.filter(item => {
        if (item.title.indexOf(req.query.title) !== -1) {
          return item
        } else {
          return
        }
      })
      setTimeout(() => {
        return res.status(200).json({
          code: 200,
          status: 'Success',
          data: sss
        })
      }, 1000)
    } else {
      events.forEach(async (event) => {
       var key = moment(event.startTime).format('YYYY-MM-DD')
       if(result[key]) {
         result[key].push(event)
       } else {
         result[key] = []
         result[key].push(event)
       }
     })
     setTimeout(() => {
       return res.status(200).json({
         code: 200,
         status: 'Success',
         data: result
       })
     }, 1000)
    }

  },
  createEvent: async (req, res) => {
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res
        .status(400)
        .json({
          code: 400,
          errors: errors.array(),
          status: "Failed",
          message: "Bad Request!",
        });
      return;
    }
    const data = req.body;
    data.user_id = req.user._id;
    const isCreateEvent = await EventModel.create(data);
    if (!isCreateEvent) {
      return res.status(200).json({
        code: 200,
        status: "Fail",
        message: "Create event failed!",
      });
    }

    req.body.participants.forEach(async (item) => {
      await PaticipantModel.create({
        event_id: isCreateEvent._id,
        user_id: item._id,
        confirm: false,
      });
    });

    return res.status(200).json({
      code: 200,
      status: "Success",
      message: "Create event success!",
    });
  },
  getEventById: async (req, res) => {
    if (!req.params.eventId) {
      return res.status(400).json({
        code: 400,
        status: "Failed",
        message: "Missing params",
      });
    }
    let response = await EventModel.findById(req.params.eventId);
    if (!response) {
      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "Event Not Found!",
      });
    }
    return res.status(200).json({
      code: 200,
      status: "Success",
      data: response,
    });
  },
  editEvent: async (req, res) => {
    if (!req.params.eventId) {
      return res.status(400).json({
        code: 400,
        status: "Failed",
        message: "Missing params",
      });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty) {
      res
        .status(400)
        .json({
          code: 400,
          error: errors.array(),
          status: "Failed",
          message: "Bad Request!",
        });
    }

    let result = await EventModel.findById(req.params.eventId);
    if (!result) {
      return res.status(200).json({
        code: 200,
        status: "Failed",
        message: "Event not found!",
      });
    } else {
      let response = await EventModel.findById(req.params.eventId).updateOne(
        req.body
      );
      if (!response) {
        return res.status(200).json({
          code: 200,
          status: "Failed",
          message: "Update Event Failed",
        });
      }
      return res.status(200).json({
        code: 200,
        status: "Success",
        message: "Update Success!",
      });
    }
  },
  deleteEventById: async (req, res) => {
    if (!req.params.eventId) {
      return res.status(200).json({
        code: 200,
        status: "Failed",
        message: "Missing Params",
      });
    }
    let result = await EventModel.findByIdAndDelete(req.params.eventId);
    if (!result) {
      return res.status(200).json({
        code: 200,
        status: "Failed",
        message: "Delete Event Failed",
      });
    }
    return res.status(200).json({
      code: 200,
      status: "Success",
      message: "Delete Event Success",
    });
  },
};
