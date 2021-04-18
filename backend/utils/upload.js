require('dotenv').config();

const util = require("util");
const logger = require("./logger");
const maxSize = 150 * 1024 * 1024;

const aws = require("aws-sdk");
const mime = require("mime");
const crypto = require("crypto");
const multer = require("multer");
const multerS3 = require("multer-s3");
const exifr = require('exifr');

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new aws.S3({
    endpoint: spacesEndpoint,
    bucket: process.env.DO_SPACES_NAME,
    accessKeyId: process.env.DO_SPACES_KEY,
    secretAccessKey: process.env.DO_SPACES_SECRET,
    acl: "public-read",
    //acl: "private",
});

const limits = {
  files: 1, // allow only 1 file per request
  fieldSize: 5 * 1024 * 1024, // (replace MBs allowed with your desires)
};

const multerUpload = multer({
  limits: limits,
  storage: multerS3({
      s3,
      endpoint: spacesEndpoint,
      bucket: process.env.DO_SPACES_NAME,
      acl: "public-read",
      key: function (req, file, cb) {
        crypto.pseudoRandomBytes(20, function (err, raw) {
          //let filename = raw.toString("hex") + Date.now() + "." + mime.getExtension(file.mimetype);
          cb(null, req.city + "/" + file.originalname);

        });
      },
  }),
});

/*
let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    logger.info(file.originalname);
    cb(null, file.originalname);
  },
});
*/

//let upload = multer({ storage: storage, limits: { fileSize: maxSize }}).single("file");
//let upload = multer({ storage: storage}).single("file");
let upload = multer(multerUpload).single("file");

//let uploadFile = util.promisify(upload);
//module.exports = uploadFile;
module.exports = upload;
