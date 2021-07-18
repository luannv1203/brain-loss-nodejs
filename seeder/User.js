const seeder = require('mongoose-seed')
const faker = require('faker')
const bcrypt = require('bcrypt');

let items = [
  {
    firstName: 'Luan',
    lastName: 'Nguyen Van',
    userName: 'luannv',
    password: bcrypt.hashSync('luannv1203', 10),
    phoneNumber: '0822912397',
    avatar: faker.image.avatar()
  }
]
for (let i = 0; i < 20; i++) {
  items.push({
    firstName: faker.name.firstName(),
    lastName: faker.name.lastName(),
    userName: faker.internet.userName(),
    password: bcrypt.hashSync('luannv1203', 10),
    phoneNumber: faker.phone.phoneNumber(),
    avatar: faker.image.avatar()
  })
}

let data = [
  {
    'model': 'User',
    'documents': items
  }
]

seeder.connect(process.env.URL_DB, {useNewUrlParser: true, useUnifiedTopology: true}, function() {
  seeder.loadModels([
    './models/User',
  ])
  seeder.clearModels(['User'], function() {
    seeder.populateModels(data, function() {
      seeder.disconnect()
    })
  })
})