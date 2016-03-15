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

exports.getBookSearch = function(req, res) {
  var queryString ="SELECT * FROM library.book_search_view ";
  var searchString = req.param('search')
  if(req.param('option') == "isbn"){
    queryString += "WHERE isbn LIKE '%"+searchString+"%'";
  }else if(req.param('option') == "booktitle"){
    queryString += "WHERE title LIKE '%"+searchString+"%'";
  }else if(req.param('option') == "author"){
    queryString += "WHERE author_name LIKE '%"+searchString+"%'";
  }else{
    queryString += "WHERE isbn LIKE '%"+searchString+"%' OR title LIKE '%"+searchString+"%' OR author_name LIKE '%"+searchString+"%'";
  }

  query_mysql_database(req,res,queryString);
};

/*exports.getCourseById = function(req, res) {
  Course.findOne({_id:req.params.id}).exec(function(err, course) {
    res.send(course);
  })
}*/