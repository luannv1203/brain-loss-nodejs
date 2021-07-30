const seeder = require('mongoose-seed')
const faker = require('faker')
const _ = require('lodash');
let tags = ['Meeting', 'Dinner', 'Call']
let items = []

for (let i = 0; i < 20; i++) {
  const day = Math.floor(Math.random() * 27 + 1)
  const i = Math.floor(Math.random() * 11 + 1)
  var key
  if (i < 10) {
    key = day < 10 ? `2021-0${i}-0${day}` : `2021-0${i}-${day}`
  } else {
    key = day < 10 ? `2021-${i}-0${day}` : `2021-${i}-${day}`
  }
  const start = new Date(key).setHours(8)
  const end = new Date(key).setHours(23,59,59,999)
  const timeStart = Math.floor(Math.random() * (end - start) + start)
  const timeEnd = Math.floor(Math.random() * (end - timeStart) + timeStart)
  let isAllDay = faker.random.boolean()
  let item = {
    title: faker.lorem.words(),
    startTime: isAllDay ? start : timeStart,
    endTime: isAllDay ? end : timeEnd,
    isAllDay: isAllDay,
    location: faker.address.streetAddress(),
    notification: isAllDay ? (start - 60 * 15 * 1000) : (new Date(timeStart).setSeconds(0, 0) - 60 * 15 * 1000),
    user_id: '60efebc2a3ee7b383a1c421b',
    note: faker.random.words(),
    tag: _.sample(tags)
  }
  items.push(item)
}

let data = [
  {
    'model': 'Event',
    'documents': items
  }
]
// const uri = 'mongodb+srv://luannv:luannv@brain-loss-db.bakke.mongodb.net/brain-loss-db?retryWrites=true&w=majority'
const uri = 'mongodb://localhost:27017/my_db'
seeder.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}, function() {
  seeder.loadModels([
    './models/Event',
    // './models/DateEvent'
  ])
  seeder.clearModels(['Event'], function() {
    seeder.populateModels(data, function() {
      seeder.disconnect()
    })
  })
})