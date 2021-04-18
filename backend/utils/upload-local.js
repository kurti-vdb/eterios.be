const util = require("util");
const multer = require("multer");
const logger = require("./logger");
const maxSize = 150 * 1024 * 1024;

let storage = multer.diskStorage({
  destination: (req, file, cb) => {
    logger.info("yyy" + file.originalname);
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    logger.info("xxx" + file.originalname);
    cb(null, req.filenameSpaces);
  },
});

//let upload = multer({ storage: storage, limits: { fileSize: maxSize }}).single("file");
let uploadlocal = multer({ storage: storage});//.single("file");

module.exports = uploadlocal;
