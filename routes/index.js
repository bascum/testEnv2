var express = require('express');
var router = express.Router();
const sql = require("mssql");

/* GET home page. */
router.get("/", function(req, res,){
  console.log("Index being gotten");
  res.sendFile(path.join(__dirname, "myapp\\build\\index.html"));
})

router.get("/up", async function(req, res,){
  try {
    console.log("This is the new location for UP");
    let result = await sql.query("SELECT * FROM test");
    res.send(result);
  }
  catch (err) {
    res.send({
      error: err,
      config: config});
  }

})

module.exports = router;
