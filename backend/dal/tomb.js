const config = require('../config/database.js');
const mysql = require('mysql2');
const pool = mysql.createPool(config.mysql);
const logger = require("../utils/logger");

exports.insertTomb = function(tomb, callback) {
    console.log(tomb);
    let sql = "INSERT INTO tomb SET ?";

    pool.getConnection(function(err, connection) {
        if(err) {
          logger.error(err);
          callback(true);
          return;
        }
        connection.query(sql, tomb, function(err, result) {
            connection.release();
            if(err) {
              logger.error(err);
              callback(true);
              return;
            }
            callback(false, result);
        });
    });
};

exports.gettombByID = function(mysqlID) {

    let sql = "SELECT * FROM tomb WHERE `ID` = ?";

    pool.getConnection(function(err, connection) {
        if(err) {
          logger.error(err);
          callback(true);
          return;
        }
        connection.query(sql, [mysqlID], function(err, result) {
          connection.release();
          if(err) {
            logger.error(err);
            callback(true);
            return;
          }
          return result;
        });
    });
};

exports.getAllTombs = function(callback) {

    let sql = "SELECT * FROM eterios.tomb a JOIN photo b ON a.ID = b.tombID";

    pool.getConnection(function(err, connection) {
        if(err) {
          logger.error(err);
          callback(true);
          return;
        }
        connection.query(sql, function(err, result) {
          connection.release();
          if(err) {
            logger.error(err);
            callback(true);
            return;
          }
          logger.info(result);
          callback(result);
        });
    });
};
