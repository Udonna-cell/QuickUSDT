function currentTime(prev, N = new Date()) {
  // Ensure both are Date objects
  const now = N instanceof Date ? N : new Date(N);
  const prevDate = new Date(prev);

  // Format components
  const Y = now.getFullYear();
  const M = now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
  const D = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
  
  // Format date string
  const formattedDate = `${Y}-${M}-${D}`;

  // Calculate difference in days
  const diffMs = now - prevDate; // milliseconds
  let diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  // Include today (+1)
  // diffDays++;

  // console.log(diffDays, "<<<<");

  return {
    Y,
    M,
    D,
    now: formattedDate,
    YMD: now,
    diffDays,
  };
}

function compareTime(prev, curr) {
  prev = new Date(prev);
  curr = new Date(curr);

  const calender = [
    { name: "Jan", date: 31 },
    { name: "Feb", date: curr.getFullYear() % 4 === 0 ? 29 : 28 },
    { name: "Mar", date: 31 },
    { name: "Apr", date: 30 },
    { name: "May", date: 31 },
    { name: "Jun", date: 30 },
    { name: "Jul", date: 31 },
    { name: "Aug", date: 31 },
    { name: "Sep", date: 30 },
    { name: "Oct", date: 31 },
    { name: "Nov", date: 30 },
    { name: "Dec", date: 31 },
  ];

  // Expected next day from prev
  const expectedDate = new Date(prev);
  expectedDate.setDate(prev.getDate() + 1);

  const onTrack =
    expectedDate.getFullYear() === curr.getFullYear() &&
    expectedDate.getMonth() === curr.getMonth() &&
    expectedDate.getDate() === curr.getDate();

  return { onTrack, calender };
}

module.exports = {
  currentTime,
  compareTime,
};