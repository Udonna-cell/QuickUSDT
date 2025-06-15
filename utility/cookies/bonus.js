require("dotenv").config();
const Database = require("../database");

async function setBonus({ userID, reward, count, streak, date }) {
  const DB = new Database();
  try {
    const result = await DB.query(
      "INSERT INTO `bonus`(`userID`, `reward`, `count`, `streak`, `date`) VALUES (?, ?, ?, ?, ?);",
      [userID, reward, count, streak, date]
    );
    return { status: result.success, ID: userID };
  } catch (error) {
    console.error("Error in setBonus:", error);
    return { status: false, ID: userID };
  }
}

async function claimBonus({ ID }) {
  const DB = new Database();
  const isActive = await isUserActive(ID);
  const { userID, reward, count, streak, date, status } = await isBonusClaimed(ID);

  if (isActive) {
    try {
      await DB.query(
        "UPDATE `bonus` SET `reward`= ?, `count`= ?, `streak`= ?, `date`= ? WHERE `userID`= ?",
        [reward, count, streak, date, userID]
      );

      const resultRaw = await DB.query("SELECT * FROM `bonus` WHERE `userID` = ?", [userID]);
      const result = JSON.parse(JSON.stringify(resultRaw.results))[0];

      try {
        await DB.query(
          "INSERT INTO `transactions`(`ID`, `amount`, `type`, `flag`, `date`) VALUES (?, ?, ?, ?, ?)",
          [ID, reward, "Credit", "Bonus", date]
        );
        console.log("Transaction recorded.");
      } catch (error) {
        console.error("Transaction not recorded:", error);
      }

      return { result, status: true, ID };
    } catch (error) {
      console.error("Error updating bonus:", error);
      return { result: null, status: false, ID };
    }
  } else {
    return await setBonus({ userID, reward, count, streak, date });
  }
}

async function isBonusClaimed(userID) {
  const DB = new Database();
  const now = new Date();
  const currentTime = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-");

  const isActive = await isUserActive(userID);
  if (!isActive) {
    return {
      userID,
      reward: Number(process.env.AMOUNT),
      count: 1,
      streak: 1,
      date: currentTime,
      day: 1,
      status: false,
    };
  }

  try {
    const res = await DB.query("SELECT * FROM `bonus` WHERE userID = ?", [userID]);
    const result = JSON.parse(JSON.stringify(res.results))[0];

    let T = parseInt(result.date.split(":")[0].split("T")[1], 10);
    let dateParts = result.date.split("T")[0].split("-").map(Number);

    // Adjust for claims at 23:xx
    if (T === 23) dateParts[2] += 1;

    const [year, month, day] = dateParts;

    if (
      year < now.getFullYear() ||
      (year === now.getFullYear() && month < now.getMonth() + 1) ||
      (year === now.getFullYear() && month === now.getMonth() + 1 && day < now.getDate())
    ) {
      const nextClaim = await setNextClaim(result, currentTime);
      nextClaim.status = false;
      return nextClaim;
    }

    const sameDayClaim = await setNextClaim(result, currentTime);
    sameDayClaim.status = true;
    return sameDayClaim;
  } catch (error) {
    console.log("User data not found or failed to fetch.");
    return {
      userID,
      reward: Number(process.env.AMOUNT),
      count: 1,
      streak: 1,
      date: currentTime,
      day: 1,
      status: false,
    };
  }
}

async function isUserActive(userID) {
  const DB = new Database();
  try {
    const result = await DB.query("SELECT * FROM `bonus` WHERE `userID` = ?", [userID]);
    return JSON.parse(JSON.stringify(result.results)).length > 0;
  } catch (error) {
    console.error("Error in isUserActive:", error);
    return false;
  }
}

async function setNextClaim({ userID, reward, count, streak, date }, now) {
  let nextClaim = {
    userID,
    reward: Number(process.env.AMOUNT),
    count,
    streak,
    date,
  };

  const dateDay = typeof date === "string" ? parseInt(date.split("-")[2]) : date[2];
  const nowDay = parseInt(now.split("-")[2]);
  const onTrack = dateDay + 1 === nowDay;

  if (onTrack) {
    nextClaim.count += 1;
    if (nextClaim.count > nextClaim.streak) {
      nextClaim.streak = nextClaim.count;
    }
  } else {
    nextClaim.count = 1;
  }

  const multiplier = nextClaim.count % 7 === 0 ? 7 : nextClaim.count % 7;
  nextClaim.reward = reward + nextClaim.reward * multiplier;
  nextClaim.day = multiplier;
  nextClaim.date = now;

  return nextClaim;
}

async function getBonus(ID) {
  const DB = new Database();
  try {
    const { results } = await DB.query("SELECT reward FROM `bonus` WHERE userID = ?", [ID]);
    return JSON.parse(JSON.stringify(results))[0].reward;
  } catch (error) {
    console.error("Failed to fetch bonus:", error);
    return 0;
  }
}

module.exports = {
  setBonus,
  isBonusClaimed,
  isUserActive,
  claimBonus,
  getBonus,
};
