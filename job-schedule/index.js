const cron = require('node-cron')
const EventModel = require('../models/Event')
const moment = require('moment')
const firebase = require('../controllers/firebase-admin')

module.exports = jobSchedule = () => {
  cron.schedule('* * * * *', async () => {
    let events = await EventModel.aggregate([
      {
        $match: {
        'notification': new Date().setSeconds(0,0)
        }
      },
      {
        $lookup: {
          from: 'paticipants',
          localField: '_id',
          foreignField: 'event_id',
          as: 'participants'
        }
      },
      {
        $unwind: {
          path: '$participants',
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $group: {
          _id: '$_id',
          'title': {'$first': '$title'},
          'startTime': {'$first': '$startTime'},
          'endTime': {'$first': '$endTime'},
          'notification': {'$first': '$notification'},
          participants: {$push: "$participants.user_id"},
          'user_id': {'$first': '$user_id'}
        }
      },
      {
        $lookup: {
          from: 'notifications',
          localField: 'user_id',
          foreignField: 'user_id',
          as: 'fcmToken'
        }
      },
      {
        $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$fcmToken", 0 ] }, "$$ROOT" ] } }
      },
      { $project: { fcmToken: 0 } },
      {
        $lookup: {
          from: 'notifications',
          localField: 'participants',
          foreignField: 'user_id',
          as: 'fcmToken'
        }
      }
    ])
    events.forEach(item => {
      var tokens = []
      if(item.token) {
        tokens.push(item.token)
      }
      item.fcmToken.forEach(fcm => {
        tokens.push(fcm.token)
      })
      const notification = {
        title: item.title,
        body: `${moment(item.startTime).format('HH:mm A')} - ${moment(item.endTime).format('HH:mm A')}`
      }
      if(tokens.length) {
        firebase.notifications(notification, tokens)
      }
    })
  })
}