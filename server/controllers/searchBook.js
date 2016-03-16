var mysql_db = require('mysql');
//var query_mysql = require('../config/mysql.js');

var pool = mysql_db.createPool({
  connectionLimit : 5,
  host     : "localhost",
  user     : "root",
  password : "root",
  database : "library"
});

function query_mysql_database(req,res,queryString){
    //console.log(queryString);
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
         // console.log(rows);
         res.json(rows);
         // return rows;
      }
    });

    connection.on('error', function (err) {
      res.json({"code": 100, "status": "Error in connection database"});
      return;
    });
  });
}

exports.getBookSearch = function(req, res) {
  var queryString ="SELECT * FROM book_search_view ";
  var searchString = req.param('search')
  if(req.param('option') == "isbn"){
    queryString += "WHERE isbn LIKE '%"+searchString+"%';";
  }else if(req.param('option') == "booktitle"){
    queryString += "WHERE title LIKE '%"+searchString+"%';";
  }else if(req.param('option') == "author"){
    queryString += "WHERE author_name LIKE '%"+searchString+"%'";
  }else{
    queryString += "WHERE isbn LIKE '%"+searchString+"%' OR title LIKE '%"+searchString+"%' OR author_name LIKE '%"+searchString+"%';";
  }

  query_mysql_database(req,res,queryString);
};
exports.getBookById = function(req, res) {
    var queryString ="SELECT * FROM book ";
    var book_id = req.params.id;
    queryString += "WHERE isbn = '"+book_id+"';";
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query( queryString, function(err, rows) {
            // And done with the connection.
            connection.release();
            if (!err) {
                //console.log(rows[0]);
                if(rows[0] === undefined){
                    res.json({"code": 404, "status": "Book ISBN not found"});
                }else{
                    res.json(rows[0]);
                }
            }
        });
    });
}
exports.getBookByIdBranchID = function(req, res) {
    var queryString ="SELECT * FROM book_search_view ";
    var book_id = req.params.id;
    var branch_id = req.params.branchId
    queryString += "WHERE isbn = '"+book_id+"' AND branch_id = '"+branch_id+"';";
    //console.log(queryString);
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query( queryString, function(err, rows) {
            // And done with the connection.
            connection.release();
            if (!err) {
                //console.log(rows[0]);
                if(rows[0] === undefined){
                    res.json({"code": 404, "status": "Book ISBN not found"});
                }else{
                    res.json(rows[0]);
                }
            }
        });
    });
}