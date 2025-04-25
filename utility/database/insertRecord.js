const Database = require("./index")

async function insertRecord({firstName, lastName, username, email, password}){
    let db = new Database()
    try {
        let result = await db.query("INSERT INTO `users` (`email`, `username`, `first-name`, `last-name`, `password`) VALUES ( ? , ?, ?, ?, ?);", [email, username, firstName, lastName, password])
        return result.success
    } catch (error) {
        console.log(error);
    }
}

module.exports = {insertRecord}