var mysql = require('mysql');

var branchSchema = mysql.Schema({
  title: {type:String, required:'{PATH} is required!'},
  featured: {type:Boolean, required:'{PATH} is required!'},
  published: {type:Date, required:'{PATH} is required!'},
  tags: [String]
});
//var Branch = mysql.model('Branch', branchSchema);
