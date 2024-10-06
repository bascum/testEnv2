var express = require('express');
var router = express.Router();
const sql = require("mssql");


router.get("/get_printers", async (req, res) => {


    responseJSON = {
        success: "",
        error: "",
        printers: []
    }

    if (req.session.loggedIn) {
        try {
            let request = new sql.Request();
            await request.input("department", sql.Int, req.session.employee.dep_num);
            let response = await request.query("SELECT * FROM Printer WHERE dep_num = @department;");
            if (response.recordset.length > 0) {
                responseJSON = {
                    ...responseJSON,
                    success: "yes",
                    printers: response.recordset
                }
            }
        }
        catch (err) {
            responseJSON = {
                ...responseJSON,
                error: err,
                success: "no",
            }
        }
    } else {
        responseJSON.error = "Must be logged in in order to get printers";
        responseJSON.success = "no";
    }

    res.send(responseJSON);
})

module.exports = router;