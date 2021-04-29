require('dotenv').config();

const logger = require("./logger");
const aws = require("aws-sdk");

const spacesEndpoint = new aws.Endpoint(process.env.DO_SPACES_ENDPOINT);
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  bucket: process.env.DO_SPACES_NAME,
  accessKeyId: process.env.DO_SPACES_KEY,
  secretAccessKey: process.env.DO_SPACES_SECRET,
  acl: "public-read",
});

const removeFromSpaces = (req, res, next) => {
  var params = {
    Bucket: process.env.DO_SPACES_NAME,
    Delete: {
      Objects: [
        { Key: req.organisation + "/original/" + req.params.filename },
        { Key: req.organisation + "/750/" + req.params.filename },
        { Key: req.organisation + "/thumbnail-250/" + req.params.filename }
      ],
    },
  };

  s3.deleteObjects(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else     console.log(data);
    next();
  });
}

module.exports = removeFromSpaces;


