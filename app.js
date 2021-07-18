var express = require('express');
var cors = require('cors')
const mongoose = require('mongoose')
require("dotenv").config()
var app = express();
const rootRouter = require('./routes')

app.use(cors())
app.get('/', function (req, res) {
  res.send('Hello World!');
});
const uri = 'mongodb+srv://luannv:luannv@brain-loss-db.bakke.mongodb.net/brain-loss-db?retryWrites=true&w=majority'
app.listen(3000, function () {
  const connection = mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}).then(() => {
    console.log('Connected Database!')
  }).catch((err) => {
    console.log(err)
  })
  console.log('Example app listening on port 3000!')

  app.use(
    express.urlencoded({
      extended: true
    })
  )
  app.use(express.json())

  //ROuter use
  app.use('/', rootRouter)
  module.exports = {connection}
});