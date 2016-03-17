/**
 * Created by Subhasis on 3/16/2016.
 */
var mysql_db = require('mysql');
//var query_mysql = require('../config/mysql');

var pool = mysql_db.createPool({
    connectionLimit : 100,
    host     : "localhost",
    user     : "root",
    password : "root",
    database : "library"
});

function dateDiff(d1,d2){
    var t2 = d2.getTime();
    var t1 = d1.getTime();
    return parseInt((t2-t1)/(24*3600*1000));
};

function checkForFines(loan_record){
    //console.log(loan_record.loan_id);
    var todayDate=new Date();
    var dueDate = new Date(loan_record.due_date);
    var fine = 0.0;
    if(loan_record.date_in === '0000-00-00' || loan_record.date_in === null){
        if(todayDate>dueDate){
            var lateDays = dateDiff(dueDate,todayDate);
            fine = lateDays * 0.25;
        }
    }else{
        var date_in=new Date(loan_record.date_in);
        var lateDays = dateDiff(dueDate,date_in);
        fine = lateDays * 0.25;
    }
    //console.log("Fines "+fine);
    if(fine>0){
        checkAndUpdateFine(loan_record,fine);
    }
};

function checkAndUpdateFine(loan_record,fine){
    var checkIfPaid= "SELECT CASE WHEN paid = 0 THEN 'no' ELSE 'yes' END AS is_paid FROM fines WHERE loan_id='"+loan_record.loan_id+"';"
    pool.getConnection(function (err, connection) {
        connection.query(checkIfPaid, function (err, rows) {
            connection.release();
            if (!err) {
                //console.log(rows);
                if(rows[0] === undefined){
                    insertFine(loan_record,fine);
                }else if(rows[0].is_paid === "no" ){
                    //console.log(rows[0].is_paid);
                    updateFine(loan_record,fine);
                }
            }
        });
    });
};
function insertFine(loan_record,fine){
    var insertFine ="INSERT INTO fines (loan_id, fine_amt, paid) VALUES ('"+loan_record.loan_id+"', '"+fine+"', 0);";
    pool.getConnection(function (err, connection) {
        connection.query(insertFine, function (err, rows) {
            connection.release();
            if (!err) {
                //console.log("Inserted");
            }
        });
    });
};
function updateFine(loan_record,fine){
    var updateFine = "UPDATE fines SET fine_amt ='"+fine+"' WHERE `loan_id`='"+loan_record.loan_id+"';";
    //console.log(updateFine);
    pool.getConnection(function (err, connection) {
        connection.query(updateFine, function (err, rows) {
            connection.release();
            if (!err) {
                //console.log("Updated");
            }
        });
    });
};


exports.updateFines = function(req, res) {
    var findActiveLoans ="SELECT * FROM book_loans Where date_in='0000-00-00' or date_in is null or date_in>due_date;";
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query(findActiveLoans, function (err, rows) {
            connection.release();
            if (!err) {
                for(var i in rows){
                    checkForFines(rows[i]);
                }
                res.json({"code": 200, "status": "Processing Started. The fine records will be updated in a few minutes."});
            }
        });
        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        });
    });
};

exports.getFines = function(req, res) {
    var queryString ="SELECT b.loan_id,b.isbn,b.branch_id,b.card_no,b.date_out,b.due_date,b.date_in," +
        "f.fine_amt as fine_amount " +
        "FROM book_loans as b,fines as f WHERE f.paid = 0 AND b.loan_id = f.loan_id " +
        "ORDER BY f.fine_amt DESC;";
    query_mysql_database(req,res,queryString);
};
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
                return;
            }
        });

        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        });
    });
}
exports.closeFine = function(req, res) {
    var queryString ="UPDATE fines SET paid =1 WHERE loan_id='"+req.body.loan_id+"';";
    pool.getConnection(function (err, connection) {
        if (err) {
            connection.release();
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        }
        connection.query(queryString, function (err, rows) {
            connection.release();
            if (!err) {
                res.json({"code": 200, "status": "Payment Accepted. Loan "+req.body.loan_id+" closed."});
                return;
            }
        });
        connection.on('error', function (err) {
            res.json({"code": 100, "status": "Error in connection database"});
            return;
        });
    });
};