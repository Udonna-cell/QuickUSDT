function initBonus(req, res) {
  if (true) {
    console.log(req.cookie);
  } else {
    
  }
  res.cookie("bonus", true, {
    maxAge: 900000,
    httpOnly: true,
    secure: false,
  });
}
module.exports = {
  initBonus,
};
