const jwt = require('jsonwebtoken');
const logger = require('./logger');
const JWT_SECRET = process.env.JWT_SECRET;

createToken = auth => {
    return jwt.sign({
        id: auth.id
    }, JWT_SECRET, { expiresIn: 60 * 120 });
}

module.exports = {

    oAuth: function(req, res, next) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        jwt.verify(token, JWT_SECRET, function(err, decodedToken) {
          req.userID = decodedToken.id;
          req.city = decodedToken.city;
        });
        next();
      }
      catch(err) {
        logger.error(err);
        res.status(401).json({ message: "Auth failed", error: err })
      }
    }

};
