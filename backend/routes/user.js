"use strict";

require('dotenv').config();

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const logger = require("../utils/logger");
const checkAuth = require('../utils/auth-check');
const uploadspaces = require('../utils/upload-spaces');
const uploadlocal = require('../utils/upload-local');
const exifr = require('exifr');
const fs = require('fs');

const photoDao = require("../dal/photo");
const Photo = require("../models/mysql/photo");


const router = express.Router();

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  next();
});

router.get("/", (req, res, next) => {
  res.status(200).json({ status: 'Success', response: "..." });
});

router.get("/files", checkAuth.oAuth, function (req, res) {

  let fileInfos = [];

  User.findOne({ _id: req.userID })
    .then(user => {
      res.status(200).send(fileInfos);
    })
    .catch(err => {
      logger.error(err);
    })
});

router.get("/photos", checkAuth.oAuth, function (req, res) {
  photoDao.getAllPhotosbyOrganisation(req.organisation, (photos) => {
    console.log(photos);
    res.status(200).send(photos);
  });
});

router.post("/login", (req, res, next) => {

  let fetchedUser;
  User.findOne({ 'username': req.body.username })
    .then(user => {
      if(!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }
      fetchedUser = user;
      return user.validatePassword(req.body.password);
    })
    .then(result => {

      if(!result) {
        return res.status(401).json({ message: "Authentication failed." });
      }
      console.log("fetcheduser" + JSON.stringify(fetchedUser));
      const token = jwt.sign({ organisation: fetchedUser.organisation, id: fetchedUser._id }, process.env.JWT_SECRET, { expiresIn: "48h" });

      res.status(200).json({
        token: token,
        expiresIn: 3600 * 48,
        user: generateAngularUser(fetchedUser)
      });
    })
    .catch(err => {
      logger.error(err);
      return res.status(401).json({ message: "Authentication failed!", error: err });
    })
});


router.post('/upload', checkAuth.oAuth, uploadspaces.single('file'), (req, res) => {

  if (req.file == undefined) {
    return res.status(400).send({ success: false, message: "Please upload a file!" });
  }

  res.status(200).send({ success: true, message: "Upload successful: " + req.file.originalname });
});

router.post('/uploadexif', checkAuth.oAuth, (req, res) => {

  let filename = req.body.filename;
  let photo = new Photo(req.body.filename, req.body.exif.latitude, req.body.exif.longitude, req.userID, req.organisation);
  photoDao.insertPhoto(photo,(err, response) => {
    if (err) {
      logger.error(err);
      res.status(500).send({ success: false, message: err });
    }
    else {
      logger.info(response);
      res.status(200).send({ success: true, message: "UploadExif successful"});
    }
  })

});


router.post("/create", (req, res, next) => {

  User.findOne({ 'username': req.body.username })
    .then(user => {

      if (user) { res.status(200).json({ message: "User already exists."}); }

      else {
        let user = new User();
        user.username = req.body.username;
        user.password = user.generateHash(req.body.password);

        user.save()
          .then(response => {
            const token = jwt.sign({ username: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: "48h" });
            res.status(200).json({ token: token, expiresIn: 3600 * 48 });
          })
          .catch(err => {
            logger.error(err);
            res.status(500).json({ message: "User not created", err: err });
          });
      }
    })
    .catch(err => {
      logger.error(err);
      res.status(500).json({ message: "Error", err: err })
    })
});

function generateAngularUser(fetchedUser) {
  return {
    id: fetchedUser._id,
    username: fetchedUser.username,
    language: fetchedUser.language,
    organisation: fetchedUser.organisation
  }
}

function generateDate(filename) {
  // cut off extension

  //take last 18 chars

  // split _

  // generate date
}

module.exports = router;
