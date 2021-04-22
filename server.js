"use strict";
require('dotenv').config();

const express         = require("express");
const morgan          = require("morgan");
const mongoose        = require("mongoose");
const bodyParser      = require("body-parser");
const logger          = require("./backend/utils/logger");
const config          = require('./backend/config/database.js');
const path            = require("path");
const authRouter  = require("./backend/routes/user");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(":date :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms"));

app.use('/api/auth/', authRouter);

mongoose.connect(config.mongodb.matchme, { useNewUrlParser: true, useUnifiedTopology: true },  function(err) {
  if (err)
    logger.info('Not connected to MongoDB: ' + err);
    //console.log('Not connected to MongoDB: ' + err);
  else
    logger.info('Successfully connected to MongoDB');
    //console.log('Successfully connected to MongoDB');
});

app.listen(port, function () {
  logger.info("(.)(.) server.js started on port " + port + " (.)(.)");
});
