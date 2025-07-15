const Database = require("./database");
const { getBalance } = require("./getBalance");

async function referrals(username) {
  const DB = new Database();
  let invitees = [];

  try {
    let { results } = await DB.query(
      'SELECT `invitee` FROM `invite` WHERE `username` = ?',
      [username]
    );
    invitees = JSON.parse(JSON.stringify(results));
  } catch (err) {
    console.error('Error fetching invitees:', err);
    return [];
  }

  // Get usernames of all invitees
  try {
    invitees = await Promise.all(
      invitees.map(async (obj) => {
        try {
          const { results } = await DB.query(
            'SELECT `username` FROM `users` WHERE `ID` = ?',
            [obj.invitee]
          );
          const user = JSON.parse(JSON.stringify(results))[0];
          return { username: user.username };
        } catch (err) {
          console.error('Error fetching username:', err);
          return null; // Skip or handle error cases
        }
      })
    );
  } catch (err) {
    console.error('Error resolving usernames:', err);
    return [];
  }

  // Filter out any nulls from failed queries
  invitees = invitees.filter(Boolean);

  // Add balances to each invitee
  try {
    invitees = await Promise.all(
      invitees.map(async (obj) => {
        try {
          const balance = await getBalance(obj.username);
          return {
            username: obj.username,
            balance: balance
          };
        } catch (err) {
          console.error('Error fetching balance:', err);
          return { username: obj.username, balance: null };
        }
      })
    );
  } catch (err) {
    console.error('Error resolving balances:', err);
    return [];
  }
  return invitees;
}

module.exports = {
  referrals
};