var express = require('express');
var router = express.Router();
const sql = require("mssql");
const cookieParser = require("cookie-parser");
const session = require("express-session");

router.post("/dashboard", async (req, res) => {
    res.send("Not implimented yet");
})

router.post("/create", async (req, res) => {
    /*
        {
            
        }
    */
})

module.exports = router;