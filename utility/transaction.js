require("dotenv").config();
const Database = require("./database");
const { currentTime, compareTime } = require("./date");

async function Balance(ID) {
    const DB = new Database();
    try {
        let {results} = await DB.query("SELECT SUM(amount) AS amount FROM `transactions` WHERE `ID`=? AND `type`=?", [ID, "Credit"])
        results = JSON.parse(JSON.stringify(results))[0].amount;
        results = results.toFixed(3)
        return results
    } catch (error) {
        console.log(error);
        return 0.00
    }
}

async function Transaction(ID, reward, type, flag) {
    const { Y, M, D, now } = currentTime();
    
    const DB = new Database();
    try {
        let {results} = await DB.query(
        "INSERT INTO `transactions`(`ID`, `amount`, `type`, `flag`, `date`) VALUES (?, ?, ?, ?, ?)",
        [ID, reward, type, flag, now]
      );
      console.log(results);
        // results = JSON.parse(JSON.stringify(results))[0].amount;
        // results = results.toFixed(3)
        // return results
    } catch (error) {
        console.log(error);
        console.log("can't record the transaction")
        // return 0.00
    }
}


module.exports = {
    Balance,
    Transaction
}