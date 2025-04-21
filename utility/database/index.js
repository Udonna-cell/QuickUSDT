const mysql = require("mysql");

class Database {
  constructor(config) {
    if (!Database.instance) {
      this._connection = mysql.createConnection(config);
      Database.instance = this
    }
    return Database.instance
  }
  set connection(config) {
    this._connection = mysql.createConnection(config);
  }
  checkConnection() {
    return new Promise((resolve, reject) => {
      this._connection.connect((err) => {
        if (err) {
          return reject({
            success: false,
            message: "connection failed",
            error: 4,
          });
        }
        resolve({ success: true, message: "connection successful" });
      });
    });
  }
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      this._connection.query(sql, params, (err, results) => {
        if (err) {
          return reject({
            success: false,
            message: "Query failed",
            error: err,
          });
        }
        resolve({ success: true, results });
      });
    });
  }
  close() {
    return new Promise((resolve, reject) => {
      this._connection.end((err) => {
        if (err) {
          return reject({
            success: false,
            message: "Error closing connection",
            error: err,
          });
        }
        resolve({ success: true, message: "Connection close" });
      });
    });
  }
}
module.exports = Database;
