/**
 * Created by Subhasis on 3/13/2016.
 */
"use strict";
var mysql = require('mysql');

module.exports = function(config) {
    var pool = mysql.createPool({
        connectionLimit : config.mysql_connection_limit,
        host     : config.mysql_host,
        user     : config.mysql_user,
        password : config.mysql_password,
        database : config.mysql_db
     });


};

/*function query_mysql_database(req,res,queryString) {

    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }

        console.log('connected as id ' + connection.threadId);

        connection.query(queryString, function (err, rows) {
            connection.release();
            if (!err) {
                res.json(rows);
            }
        });

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        });
    });
}
exports.query_mysql_database = query_mysql_database;*/