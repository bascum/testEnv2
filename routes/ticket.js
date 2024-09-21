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

router.post("/assign", async (req, res) => {
    /* Input
        {
            username: "", Username to be assigned to
            ticket_number: "", Ticket to assign
        }
    */

    let JSONResponse = {
        success: "",
        error: "",
    };

    let request = new sql.Request();
    let sqlResponse;

    if (!req.session.loggedIn) {
        JSONResponse = {
            ...JSONResponse,
            success: "no",
            error: "Unable to assign ticket if not logged in",
        }
    } else if (req.session.employee.type < 3) {
        JSONResponse = {
            ...JSONResponse,
            success: "no",
            error: "User lacks access to assign tickets",
        }
    } else {
        try {
            console.log(req.body);
            await request.input ("username", sql.VarChar(50), req.body.username);
            console.log(req.session.employee);
            await request.input ("requestor_id", sql.Int, req.session.employee.employee_id);
            let targetEmployee = await request.query("SELECT * FROM [User] WHERE username = @username;");
            let requestor = await request.query("SELECT * FROM [User] WHERE employee_id = @requestor_id;");
            targetEmployee = targetEmployee.recordset[0];
            console.log(targetEmployee);
            requestor = requestor.recordset[0];
            console.log(requestor);
            await request.input ("ticket_num", sql.Int, req.body.ticket_number);
            await request.input ("employee_id", sql.Int, targetEmployee.employee_id);
            await request.input ("employee_name", sql.VarChar(50), targetEmployee.name);
            await request.input ("requestor_name", sql.VarChar(50), requestor.name);
            sqlResponse = await request.query(`
                IF EXISTS (SELECT 1 FROM ticket_assignment WHERE ticket_num = @ticket_num)
                BEGIN
                    -- Update the row if the ticket_num exists
                    UPDATE ticket_assignment
                    SET
                        employee_id = @employee_id
                    WHERE
                        ticket_num = @ticket_num;
                END
                ELSE
                BEGIN
                    -- Insert a new row if the ticket_num does not exist
                    INSERT INTO ticket_assignment (ticket_num, employee_id)
                    VALUES (@ticket_num, @employee_id);
                END
            `);

            console.log("Insert passed");
            request.query(`INSERT INTO Comment (ticket_num, employee_id, content)
                                VALUES (@ticket_num, @requestor_id,
                                'Ticket assigned by ' + CAST(@requestor_name AS VARCHAR) + ' to ' + CAST(@employee_name AS VARCHAR) + ' on ' + CAST(getdate() AS VARCHAR));`
            );

            JSONResponse = {
                ...JSONResponse,
                success: "yes"
            }
        } catch (err) {
            JSONResponse = {
                ...JSONResponse,
                success: "no",
                error: err,
            }
        }
    }

    res.send(JSONResponse);

})

module.exports = router;