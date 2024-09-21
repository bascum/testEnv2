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
            printer_num: "",
            type: "",
            description: "",
            callback: "",
        }
    */

    let JSONResponse = {
        success: "",
        ticket_num: "",
        error: "",
    };

    let request = new sql.Request();

    if (req.session.loggedIn) {
        if ((req.body.printer_num == "") || (req.body.type == "") || (req.body.description == "")) {
            JSONResponse = {
                ...JSONResponse,
                success: "no",
                error: "Missing required info",
            };
        } else {
            try {
                await request.input('printer_num', sql.Int, req.body.printer_num);
                await request.input("type", sql.TinyInt, req.body.type);
                await request.input("description", sql.Text, req.body.description);
                if (req.body.callback == "") {
                    await request.input("callback", sql.Int, req.session.employee.def_callback);
                } else {
                    await request.input("callback", sql.Int, req.body.callback);
                }
                await request.input("created_by", sql.Int, req.session.employee.employee_id);
                //await request.input("created_on", sql.DateTime, currentDateTime);
                await request.input("status", sql.TinyInt, 1);
                await request.input("priority", sql.TinyInt, 1);

                let result = await request.query("INSERT INTO [Ticket] (printer_num, type, description, callback, created_by, status, priority) OUTPUT inserted.ticket_num VALUES (@printer_num, @type, @description, @callback, @created_by, @status, @priority);");
                //let result = await request.query("SELECT * FROM [Ticket] WHERE printer_num = @printer_num AND status = 1 AND created_by = @created_by AND ");
                console.log(result);
                JSONResponse = {
                    ...JSONResponse,
                    ticket_num: result.recordset[0].ticket_num,
                    success: "yes",
                };
            } catch (err) {
                JSONResponse = {
                    ...JSONResponse,
                    success: "no",
                    error: "Missing required info",
                };
                console.log(err);
            }
        }

    } else {
        JSONResponse = {
            ...JSONResponse,
            success: "no",
            error: "Please log in to create a ticket",
        }
    }

    res.send(JSONResponse);
    /*
        {
            success: "",
            ticket_num: "",
            error: "",
        }
    */
})

module.exports = router;