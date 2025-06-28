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

module.exports = {
    Balance
}