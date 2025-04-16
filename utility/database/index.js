const mysql = require("mysql");
const { KEY } = require("./key");

class Database {
  constructor() {
    this.connection = mysql.createConnection(KEY);
  }
  checkConnection() {
    return new Promise((resolve, reject) => {
      this.connection.connect((err) => {
        if (err) {
          return reject({
            success: false,
            message: "connection failed",
            error: err,
          });
        }
        resolve({ success: true, message: "connection successful" });
      });
    });
  }
  query(sql, params = []) {
    return new Promise((resolve, reject)=> {
      this.connection.query(sql, params, (err, results)=>{
        if (err) {
          return reject({ success: false, message: "Query failed", error: err })
        }
        resolve({ success: true, results })
      })
    })
  }
  close() {
    return new Promise((resolve, reject)=>{
      this.connection.end((err)=> {
        if (err) {
          return reject({ success: false, message: "Error closing connection", error: err })
        }
        resolve({ success: true, message: "Connection close" })
      })
    })
  }
}
module.exports = Database;
