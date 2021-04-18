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

router.post("/login", (req, res, next) => {

  logger.info(req.body.username);

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
      const token = jwt.sign({ city: fetchedUser.username, id: fetchedUser._id }, process.env.JWT_SECRET, { expiresIn: "48h" });

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

  console.log(req.file);
  if (req.file == undefined) {
    return res.status(400).send({ success: false, message: "Please upload a file!" });
  }

  res.status(200).send({ success: true, message: "Upload successful: " + req.file.originalname });
});

router.get('/multerupload', (req, res, next) => {
  exifr.parse('https://eterios.ams3.digitaloceanspaces.com/kurti/JP%2031%20maart%20test%20MP_20210331_122615965.jpg')
    .then(output => {
      logger.info("Olleke" + JSON.stringify(output));
      res.status(200).send({ message: "Upload successful: " + req.file.originalname });
    })
    .catch(err => {
      logger.error("exifr: " + err);
      res.status(200).send({ message: "error: " + err });
      next();
    });


})

router.post('/exifr', checkAuth.oAuth, (req, res) => {

  logger.info(req.file);
  if (req.file == undefined) {
    return res.status(400).send({ message: "Please upload a file!" });
  }

  exifr.parse(req.file.location)
    .then(output => {
      logger.info("Olleke" + JSON.stringify(output));
      res.status(200).send({ message: "Upload successful: " + req.file.originalname });
    })
    .catch(err => logger.error("exifr: " + err));
});

/*
router.post("/upload", checkAuth.oAuth, async (req, res, next) => {

  try {

    console.log(req.body);
    //await uploadFile(req, res);
    //exifr.parse("./uploads/" + req.file.originalname).then(output => console.log("Olleke" + JSON.stringify(output))).catch(err => console.log(err));
    upload(req, res, (err) => {
      if (err) {
        console.log(err);
      }

      exifr.parse("https://eterios.ams3.digitaloceanspaces.com/"+ req.city + "/" + req.file.originalname)
      .then(output => {
        console.log("Olleke" + JSON.stringify(output))
      })
      .catch(err => console.log("eee" + err));


      if (req.file == undefined) {
        return res.status(400).send({ message: "Please upload a file!" });
      }
      res.status(200).send({ message: "Upload successful: " + req.file.originalname });

    })
  }
  catch (err) {
    logger.error("Try catch error: " + err);
    res.status(500).send({ message: `Could not upload the file: ${req.file}. ${err}` });
  }
})
*/

router.post("/create", checkAuth.oAuth, (req, res, next) => {

  User.findOne({ 'username': req.body.username })
    .then(user => {

      if (user) { res.status(200).json({ message: "User already exists."}); }

      else {
        let user = new User();
        user.username = req.body.username;
        user.password = user.generateHash(req.body.password);

        user.save()
          .then(response => {
            const token = jwt.sign({ email: user.username, id: user._id }, process.env.JWT_SECRET, { expiresIn: "48h" });
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
    organisationName: fetchedUser.organisationName
  }
}

module.exports = router;
