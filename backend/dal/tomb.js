const config = require('../config/database.js');
const mysql = require('mysql2');
const pool = mysql.createPool(config.mysql);

exports.insertTomb = function(tomb, callback) {

    let sql = "INSERT INTO tomb SET ?";

    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            callback(true);
            return;
        }
        connection.query(sql, tomb, function(err, result) {
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

exports.gettombByID = function(mysqlID) {

    let sql = "SELECT * FROM tomb WHERE `ID` = ?";

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

exports.getAllTombs = function() {

    let sql = "SELECT * FROM tomb";

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
