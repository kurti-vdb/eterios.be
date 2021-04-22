const config = require('../config/database.js');
const mysql = require('mysql');
const pool = mysql.createPool(config.mysql);

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

exports.getAllPhotos = function() {

    let sql = "SELECT * FROM photo";

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
