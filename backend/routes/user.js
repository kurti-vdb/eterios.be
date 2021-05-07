"use strict";

require('dotenv').config();

const express = require("express");
const jwt = require("jsonwebtoken");
const User = require('../models/user');
const logger = require("../utils/logger");
const checkAuth = require('../utils/auth-check');
const uploadspaces = require('../utils/upload-spaces');
const removeFromSpaces = require('../utils/remove-spaces');
const exifr = require('exifr');
const fs = require('fs');
const geo = require('node-geo-distance');


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
    res.status(200).send(photos);
  });
});

router.get("/calculateConcessions/:distance?", function (req, res) {
  photoDao.calculateConcessions( response => {

    let result = extractConcessions(response, req.params.distance);

    res.status(200).send(result);
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

router.delete('/:filename', checkAuth.oAuth, removeFromSpaces, (req, res) => {

  photoDao.deletePhoto(req.params.filename, (err, response) => {
    if (err) {
      logger.error(err);
      res.status(500).send({ success: false, message: err });
    }
    else {
      res.status(200).send({ success: true, message: "Photo removed", response: response });
    }
  })

});

router.post('/uploadexif', checkAuth.oAuth, (req, res) => {


  let photo = new Photo(req.body.filename, req.body.exif.latitude, req.body.exif.longitude, req.userID, req.organisation, generateDate(req.body.filename));

  photoDao.insertPhoto(photo, (err, response) => {
    if (err) {
      logger.error(response);
      res.status(500).send({ success: false, message: response });
    }
    else {
      res.status(200).send({ success: true, message: "Photo saved in mysql", photo: photo, response: response });
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


const extractConcessionsOrg = (files) => {

  console.log(files);

  for(let i = 0; i < files.length-1; i++) {
    var coord1 = {
      latitude: files[i].lat,
      longitude: files[i].lng
    }

    var coord2 = {
      latitude: files[i+1].lat,
      longitude: files[i+1].lng
    }

    console.log(geo.vincentySync(coord1, coord2));
  }

}


const extractConcessions = (files, distanceBetween) => {

  let _distanceBetween = 1;

  if (distanceBetween && Number.parseFloat(distanceBetween)) {
    _distanceBetween = distanceBetween;
  }

  let concessions = [];
  let temp = [];
  let indexesToBeRemoved = [];
  let initialLength = files.length;

  console.log("-------------------------------------------------------------------------------------")

  while(files.length > 0 ) {

    let element = files[0]
    temp.push(element);
    files.splice(0, 1);

    for(let i = 0; i < files.length; i++) {

      var coord1 = {
        latitude: element.lat,
        longitude: element.lng
      }

      var coord2 = {
        latitude: files[i].lat,
        longitude: files[i].lng
      }

      let distance = geo.vincentySync(coord1, coord2);
      console.log(element.filename + "-" + files[i].filename + ": " + distance);
      if (distance < _distanceBetween ) {
        temp.push(files[i]);
        indexesToBeRemoved.push(i);
      }
      console.log(files)
    }

    for (var i = indexesToBeRemoved.length -1; i >= 0; i--) {
      files.splice(indexesToBeRemoved[i], 1);
    }

    //console.log(temp);
    concessions.push([...temp]);
    temp = [];
    indexesToBeRemoved = [];

  }
  console.log("*****************************************************************************************************")
  console.log("Final result", concessions);

  return concessions;

}




function generateDate(filename) {

  // cut off extension
  filename = filename.substring(0, filename.length - 6);

  //take last 18 chars
  let last18 = filename.substr(filename.length - 18);

  // split _
  let split = last18.split("_");

  // generate date
  let year        = split[0].substring(0,4);
  let month       = split[0].substring(4,6);
  let day         = split[0].substring(6,8);
  let hours       = split[1].substring(0,2);
  let minutes     = split[1].substring(2,4);
  let seconds     = split[1].substring(4,6);
  let millis      = split[1].substring(6,9);

  let date        = new Date(year, month-1, day, hours, minutes, seconds, millis);

  return date;
}

module.exports = router;
