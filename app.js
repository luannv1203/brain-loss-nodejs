var express = require("express");
var cors = require("cors");
const mongoose = require("mongoose");
const job = require("./job-schedule");
var admin = require("firebase-admin")
var service = require('./configs/brain-loss-firebase-adminsdk-yjb70-0a3f903af7.json')

if (process.env.NODE_ENV && process.env.NODE_ENV === "production") {
  require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
} else {
  require("dotenv").config();
}

admin.initializeApp({
  credential: admin.credential.cert(service),
  databaseURL: "https://brain-loss-default-rtdb.firebaseio.com"
});
var app = express();
const rootRouter = require("./routes");

app.use(cors());
app.get("/", function (req, res) {
  res.send("Hello World!");
});

const uri = process.env.URL_DB;
var port = process.env.PORT || 8080;
app.listen(port, function () {
  const connection = mongoose
    .connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    })
    .then(() => {
      console.log("Connected Database!");
    })
    .catch((err) => {
      console.log(err);
    });
  console.log("Example app listening on port 3000!");

  app.use(
    express.urlencoded({
      extended: true,
    })
  );
  app.use(express.json());

  //ROuter use
  app.use("/", rootRouter);
  job()
  module.exports = { connection };
});
