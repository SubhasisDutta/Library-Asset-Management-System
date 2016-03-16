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

exports.getLoanSearch = function(req, res) {
  var queryString ="SELECT * FROM BOOK_LOAN_SEARCH_VIEW ";
  var searchString = req.param('search')
  if(req.param('option') == "isbn"){
    queryString += "WHERE isbn LIKE '%"+searchString+"%';";
  }else if(req.param('option') == "card_no"){
    queryString += "WHERE card_no LIKE '%"+searchString+"%';";
  }else if(req.param('option') == "name"){
    queryString += "WHERE name LIKE '%"+searchString+"%'";
  }else{
    queryString += "WHERE isbn LIKE '%"+searchString+"%' OR card_no LIKE '%"+searchString+"%' OR name LIKE '%"+searchString+"%';";
  }

  query_mysql_database(req,res,queryString);
};

exports.getLoanById = function(req, res) {
    var queryString ="SELECT * FROM BOOK_LOAN_SEARCH_VIEW ";
    var isbn = req.params.isbn;
    var branch_id = req.params.branch_id;
    var card_no = req.params.card_no;
    queryString += "WHERE isbn = '"+isbn+"' AND branch_id = '"+branch_id+"' AND card_no = '"+card_no+"' LIMIT 1;";
    //console.log(queryString);
    pool.getConnection(function(err, connection) {
        // Use the connection
        connection.query( queryString, function(err, rows) {
            // And done with the connection.
            connection.release();
            if (!err) {
                //console.log(rows[0]);
                if(rows[0] === undefined){
                    res.json({"code": 404, "status": "No Loan found."});
                }else{
                    res.json(rows[0]);
                }
            }
        });
    });
}