function currentTime() {
  let now = new Date();
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
  };
}

function compareTime({ year, month, date }, { Y, M, D, now }) {
  const calender = [
    { name: "Jan", date: 31 },
    { name: "Feb", date: Y % 4 == 0 ? 29 : 28 },
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
  let expectedDate = {
    y: 0,
    m: 0,
    d: 0,
  };
  if (date + 1 >= calender[month - 1]) {
    if (month + 1 > 12) {
      expectedDate.m = 1;
      expectedDate.y = year + 1;
    } else {
      expectedDate.m = month + 1;
      expectedDate.y = year;
    }

    expectedDate.d =
      date + 1 - calender[month - 1] > 0
        ? date + 1 - calender[month - 1]
        : calender[month - 1];
  } else {
    expectedDate.d = date + 1;
    expectedDate.y = year;
    expectedDate.m = month;
  }

  let onTrack = new Array(3)
    .fill(false)
    .map((v, i) => {
      if (i == 0) {
        return Y - 0 == expectedDate.y;
      }
      if (i == 1) {
        return M - 0 == expectedDate.m;
      }
      if (i == 2) {
        return D - 0 == expectedDate.d;
      }
    })
    .every((v) => v == true);
  return { onTrack, calender };
}

module.exports = {
  currentTime,
  compareTime,
};
