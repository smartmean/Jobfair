const mysql = require("mysql2");

var connection = mysql.createPool({
    host: 'localhost',
    //user: 'root',
    //password: '12345678',
    database: 'vacCenter'
});
console.log(connection);
module.exports = connection;