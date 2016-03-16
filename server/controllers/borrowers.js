/**
 * Created by Subhasis on 3/15/2016.
 */
var mysql_db = require('mysql');
//var query_mysql = require('../config/mysql');

var pool = mysql_db.createPool({
    connectionLimit : 5,
    host     : "localhost",
    user     : "root",
    password : "root",
    database : "library"
});

function query_mysql_database(req,res,queryString){
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

exports.getBorrowerList = function(req, res) {
    var queryString ="SELECT card_no, concat(fname,' ',lname) as name FROM borrower ORDER BY name;";
    query_mysql_database(req,res,queryString);
};
exports.checkoutBook = function(req, res) {
    console.log(req.body);
    validateAndCheckOut(req, res);

    //res.json({"code": 404, "status": "Book ISBN not found"});
    //var queryString ="SELECT card_no, concat(fname,' ',lname) as name FROM borrower ORDER BY name;";
    //query_mysql_database(req,res,queryString);
};
function validateAndCheckOut(req, res){
    var checkValidBorrower = "SELECT * FROM BORROWER WHERE card_no="+req.body.card_no+"';";
    pool.getConnection(function(err, connection) {
        connection.query( checkValidBorrower, function(err, rows) {
            connection.release();
            if (!err) {
                if(rows[0] === undefined){
                    res.json({"code": 404, "status": "Borrower Data Doesn't Exist."});
                    return;
                }
            }else{
                console.log("Checked Borrower");
                checkNoPendingFines(req,res);
            }
        });
        connection.on('error', function (err) {
            res.json({"code": 500, "status": "Error in connection database"});
            return;
        });
    });
}
function checkNoPendingFines(req,res){
    var checkPendingPayment = "SELECT count(*) as count FROM book_loans bl inner join fines f on bl.loan_id = f.loan_id WHERE bl.card_no='"+req.body.card_no+"' and f.paid=0;"
    pool.getConnection(function(err, connection) {
        connection.query( checkPendingPayment, function(err, rows) {
            connection.release();
            if (!err) {
                console.log(rows[0].count);
                if(rows[0].count > 0){
                    res.json({"code": 400, "status": "Borrower has a pending payment."});
                    return;
                }else{
                    console.log("Checked Borrower Payment Limit");
                    checkBorrowingLimit(req,res);
                }
            }
        });
    });
}
function checkBorrowingLimit(req,res){
    var checkBorrowLimit = "SELECT count(*) as count FROM book_loans WHERE card_no='"+req.body.card_no+"' and (date_in = '0000-00-00' or date_in is null);"
    pool.getConnection(function(err, connection) {
        connection.query( checkBorrowLimit, function(err, rows) {
            connection.release();
            if (!err) {
                console.log(rows[0].count);
                if(rows[0].count > 3){
                    res.json({"code": 400, "status": "Borrower Book Loan Limit Exceeded! Only 3 Book Loans Permitted."});
                    return;
                }else{
                    console.log("Checked Borrower Book Limit");
                    checkBookavailability(req,res);
                }
            }
        });
    });
}
function checkBookavailability(req,res){
    var checkBookAvailable ="SELECT no_of_available_copies as count FROM book_search_view WHERE isbn = '"+req.body.isbn+"' AND branch_id = '"+req.body.branch_id+"';";
    pool.getConnection(function(err, connection) {
        connection.query( checkBookAvailable, function(err, rows) {
            connection.release();
            if (!err) {
                console.log(rows);
                if(rows[0].count < 1){
                    res.json({"code": 400, "status": "Book not Available."});
                    return;
                }else{
                    console.log("Checked Book Limit");
                    insertIntoBookLoans(req,res);
                }
            }
        });
    });
}

function formatDate(dateObj){
    return dateObj.getFullYear()+"-"+(dateObj.getMonth()+1)+"-"+dateObj.getDate();
}
function insertIntoBookLoans(req,res){
    var todayDate = new Date();
    var dueDate= new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    var insertBookLoan = "INSERT INTO book_loans(isbn,branch_id,card_no,date_out,due_date) VALUES ('"+req.body.isbn+"','"+req.body.branch_id+"','"+req.body.card_no+"','"+formatDate(todayDate)+"','"+formatDate(dueDate)+"');"
    console.log(insertBookLoan);
    pool.getConnection(function(err, connection) {
        connection.query( insertBookLoan, function(err, rows) {
            connection.release();
            if (!err) {
                res.json({"code": 200, "status": "Book Checked Out Successfully!"});
                return;
            }
        });
    });
}
