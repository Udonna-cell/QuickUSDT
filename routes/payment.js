const express = require('express');
const router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    let data = JSON.stringify(req.body)
    let {address} = JSON.parse(data)
    
  res.send("done")
});

module.exports = router;
