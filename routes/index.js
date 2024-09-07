var express = require('express');
var router = express.Router();
const sql = require("mssql");

/* GET home page. */
router.get("/", function(req, res,){
  console.log("Index being gotten");
  res.sendFile(path.join(__dirname, "myapp\\build\\index.html"));
})

module.exports = router;
