require('dotenv').config();

module.exports = {

  mongodb: {
    matchme : process.env.MONGO_HOST,
  },
  mysql: {
    host        : process.env.MYSQL_HOST,
    user        : process.env.MYSQL_USER,
    port        : process.env.MYSQL_PORT,
    password    : process.env.MYSQL_PASSWORD,
    database    : process.env.MYSQL_RESOURCES_DB
  }
};
