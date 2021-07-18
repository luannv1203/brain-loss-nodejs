const event = require('./seeder/Event')
const user = require('./seeder/User')

async function db_seed() {
  await event()
  await user()
  console.log('data generate successfull');
}
