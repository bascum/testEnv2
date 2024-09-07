var express = require('express');
var router = express.Router();
const sql = require("mssql");

router.get("/up", async function(req, res,){
    try {
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