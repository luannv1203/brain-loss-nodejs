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
    notification: faker.lorem.words(),
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

seeder.connect(process.env.URL_DB, {useNewUrlParser: true, useUnifiedTopology: true}, function() {
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