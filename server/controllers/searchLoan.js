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
};
exports.checkInBook = function(req, res) {
    console.log(req.body);
    checkLoanAvailability(req, res);
};
function checkLoanAvailability(req,res){
    var checkBookAvailable ="SELECT count(*) as count FROM BOOK_LOAN_SEARCH_VIEW WHERE isbn = '"+req.body.isbn+"' AND branch_id = '"+req.body.branch_id+"' AND card_no = '"+req.body.card_no+"' LIMIT 1;";
    pool.getConnection(function(err, connection) {
        connection.query( checkBookAvailable, function(err, rows) {
            connection.release();
            if (!err) {
                console.log(rows[0]);
                if(rows[0].count < 1){
                    res.json({"code": 400, "status": "Loan not Available."});
                    return;
                }else{
                    updateIntoBookLoans(req,res);
                }
            }
        });
    });
}
function formatDate(dateObj){
    return dateObj.getFullYear()+"-"+(dateObj.getMonth()+1)+"-"+dateObj.getDate();
}
function updateIntoBookLoans(req,res){
    var todayDate = new Date();
    var updateBookLoan = "UPDATE book_loans SET date_in='"+formatDate(todayDate)+"' WHERE card_no='"+req.body.card_no+"' AND isbn='"+req.body.isbn+"' AND branch_id='"+req.body.branch_id+"' LIMIT 1;";
    pool.getConnection(function(err, connection) {
        connection.query( updateBookLoan, function(err, rows) {
            connection.release();
            if (!err) {
                res.json({"code": 200, "status": "Book Checked In Successfully!"});
                return;
            }
        });
    });
}