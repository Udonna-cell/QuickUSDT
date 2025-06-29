function currentTime() {
  let now = new Date();
  let YMD = now;
  let M =
    now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;

  let D = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();
  let Y = now.getFullYear();
  now = `${Y}-${M}-${D}`;
  return {
    Y,
    M,
    D,
    now,
    YMD,
  };
}

function compareTime(prev, curr) {
  prev = new Date(prev)
  curr = new Date(curr)
  const calender = [
    { name: "Jan", date: 31 },
    { name: "Feb", date: curr.getFullYear() % 4 == 0 ? 29 : 28 },
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
  
  // Next date from he previous
  let expectedDate = new Date(prev)
  expectedDate.setDate(prev.getDate() + 1)
  // console.log(prev, expectedDate.getDate(), curr.getDate());
  // console.log(expectedDate.getFullYear() === curr.getFullYear());
  // console.log(expectedDate.getMonth() === curr.getMonth());
  // console.log(expectedDate.getDate() === curr.getDate());

  let onTrack =  (
    expectedDate.getFullYear() === curr.getFullYear() &&
    expectedDate.getMonth() === curr.getMonth() &&
    expectedDate.getDate() === curr.getDate()
  );
  return { onTrack, calender };
}

module.exports = {
  currentTime,
  compareTime,
};
