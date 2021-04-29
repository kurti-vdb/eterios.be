const config = require('../config/database.js');
const mysql = require('mysql');
const pool = mysql.createPool(config.mysql);
const logger = require("../utils/logger");

exports.insertPhoto = function(photo, callback) {

  let sql = "INSERT INTO photo SET ?";

  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, photo, function(err, result) {
      connection.release();
      if(err) {
        console.log(err);
        callback(true, err);
        return;
      }
      callback(false, result);
    });
  });
};

exports.deletePhoto = function(filename, callback) {

  let sql = "DELETE FROM photo WHERE filename = ?";

  pool.getConnection(function(err, connection) {
    if(err) {
      console.log(err);
      callback(true);
      return;
    }
    connection.query(sql, filename, function(err, result) {
      connection.release();
      if(err) {
        console.log(err);
        callback(true);
        return;
      }
      callback(false, result);
    });
  });
};

exports.getPhotoByID = function(mysqlID) {

    let sql = "SELECT * FROM photo WHERE `ID` = ?";

    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            callback(true);
            return;
        }
        connection.query(sql, [mysqlID], function(err, result) {
            connection.release();
            if(err) {
                console.log(err);
                callback(true);
                return;
            }
            return result;
        });
    });
};


exports.getAllPhotosbyOrganisation = function(organisation, callback) {

  let sql = "SELECT * FROM photo JOIN user ON photo.uploaderID = user.mongoID WHERE photo.organisationID = ?";

  pool.getConnection(function(err, connection) {
      if(err) {
        logger.error(err);
        callback(true);
        return;
      }
      connection.query(sql, [organisation], function(err, result) {
        connection.release();
        if(err) {
          logger.error(err);
          callback(true);
          return;
        }
        //logger.info(result);
        callback(result);
      });
  });
};
