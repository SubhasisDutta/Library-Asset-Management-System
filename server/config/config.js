var path = require('path');
var rootPath = path.normalize(__dirname + '/../../');

module.exports = {
  development: {
    db: 'mongodb://localhost/library',
    mysql_user: 'root',
    mysql_password: 'root',
    mysql_host: 'localhost',
    mysql_db: 'library',
    mysql_connection_limit:100,
    rootPath: rootPath,
    port: process.env.PORT || 3030
  },
  production: {
    rootPath: rootPath,
    db: 'mongodb://jeames:multivision@ds053178.mongolab.com:53178/multivision',
    port: process.env.PORT || 80
  }
}