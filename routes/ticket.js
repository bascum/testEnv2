var express = require('express');
var router = express.Router();
const sql = require("mssql");
const cookieParser = require("cookie-parser");
const session = require("express-session");

router.get("/dashboard/get_tickets", async (req, res) => {


    /*
        responseJSON {
            success: "",
            error: "",
            tickets: [],
        }

        ticket {
            ticketNum:
            status:
            printer_num:
            creation_date:
            created_by:
            assigned_date:
            assigned_to:

        }
    */

    responseJSON = {
        success: "",
        error: "",
        tickets: []
    }


    if (req.session.loggedIn) {
        let request = new sql.Request();
        let result;
        try {
            await request.input("employee_id", sql.Int, req.session.employee.employee_id);
            await request.input("department", sql.Int, req.session.employee.dep_num);
            if (req.session.employee.type == 1) {
                result = await request.query(`
                SELECT t.ticket_num, t.priority, t.status, t.printer_num, p.make_and_model, p.[location], t.created_on, u1.name, ta.assigned_date, u2.name, t.description, d.name, d.dep_id
                FROM Ticket t
                LEFT JOIN [User] u1 ON t.created_by = u1.employee_id
                LEFT JOIN Ticket_Assignment ta ON t.ticket_num = ta.ticket_num
                LEFT JOIN [User] u2 ON ta.employee_id = u2.employee_id
                LEFT JOIN Printer p ON t.printer_num = p.inv_num
                LEFT JOIN Department d ON p.dep_num = d.dep_id
                WHERE t.created_by = @employee_id AND t.status != 0
                ORDER BY t.created_on;
            `)
                responseJSON = {
                    ...responseJSON,
                    success: "yes",
                    tickets: result.recordset
                }
            } else if (req.session.employee.type == 2) { //Dep admins will need to see all tickets for their dep
                let getDepTickets = `
                SELECT t.ticket_num, t.priority, t.status, t.printer_num, p.make_and_model, p.[location], t.created_on, u1.name, ta.assigned_date, u2.name, t.description, d.name, d.dep_id
                FROM Ticket t
                LEFT JOIN [User] u1 ON t.created_by = u1.employee_id
                LEFT JOIN Ticket_Assignment ta ON t.ticket_num = ta.ticket_num
                LEFT JOIN [User] u2 ON ta.employee_id = u2.employee_id
                LEFT JOIN Printer p ON t.printer_num = p.inv_num
                LEFT JOIN Department d ON p.dep_num = d.dep_id
                WHERE p.dep_num = @department AND t.status != 0
                ORDER BY t.created_on;
            `

                result = await request.query(getDepTickets); //May not insert dep variable properly?
                responseJSON = {
                    ...responseJSON,
                    success: "yes",
                    tickets: result.recordset
                }


            } else if (req.session.employee.type == 3) { //techs will need to see all tickets assigned to them
                getAssignedTickets = `
                SELECT t.ticket_num, t.priority, t.status, t.printer_num, p.make_and_model, p.[location], t.created_on, u1.name, ta.assigned_date, u2.name, t.description, d.name, d.dep_id
                FROM Ticket t
                LEFT JOIN [User] u1 ON t.created_by = u1.employee_id
                LEFT JOIN Ticket_Assignment ta ON t.ticket_num = ta.ticket_num
                LEFT JOIN [User] u2 ON ta.employee_id = u2.employee_id
                LEFT JOIN Printer p ON t.printer_num = p.inv_num
                LEFT JOIN Department d ON p.dep_num = d.dep_id
                WHERE ta.employee_id = @employee_id AND t.status != 0
                ORDER BY t.created_on;
            `;

                result = await request.query(getAssignedTickets);
                responseJSON = {
                    ...responseJSON,
                    success: "yes",
                    tickets: result.recordset
                }

            } else if (req.session.employee.type == 4) { //Super admin will need to see all tickets. Will likely need
                //New front end view to sort

                result = await request.query(`
                SELECT t.ticket_num, t.priority, t.status, t.printer_num, p.make_and_model, p.[location], t.created_on, u1.name, ta.assigned_date, u2.name, t.description, d.name, d.dep_id
                FROM Ticket t
                LEFT JOIN [User] u1 ON t.created_by = u1.employee_id
                LEFT JOIN Ticket_Assignment ta ON t.ticket_num = ta.ticket_num
                LEFT JOIN [User] u2 ON ta.employee_id = u2.employee_id
                LEFT JOIN Printer p ON t.printer_num = p.inv_num
                LEFT JOIN Department d ON p.dep_num = d.dep_id
                WHERE t.status != 0
                ORDER BY t.created_on;
            `)

                responseJSON = {
                    ...responseJSON,
                    success: "yes",
                    tickets: result.recordset
                }

            }
        } catch (err) {
            responseJSON = {
                ...responseJSON,
                success: "no",
                error: err
            }
        }

    } else {
        responseJSON = {
            ...responseJSON,
            success: "no",
            error: "Must be logged in to retreive tickets",
        }
    }

    res.send(responseJSON);
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
                    await request.input("callback", sql.BigInt, req.session.employee.def_callback);
                } else {
                    await request.input("callback", sql.BigInt, parseInt(req.body.callback));
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
                    error: "Something messed up in the insert",
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
            ID: "", Id to be assigned to
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
            await request.input("target_id", sql.Int, req.body.id);
            console.log(req.session.employee);
            await request.input("requestor_id", sql.Int, req.session.employee.employee_id);
            let targetEmployee = await request.query("SELECT * FROM [User] WHERE employee_id = @target_id;");
            let requestor = await request.query("SELECT * FROM [User] WHERE employee_id = @requestor_id;");
            targetEmployee = targetEmployee.recordset[0];
            console.log(targetEmployee);
            requestor = requestor.recordset[0];
            console.log(requestor);
            await request.input("ticket_num", sql.Int, req.body.ticket_number);
            await request.input("employee_id", sql.Int, targetEmployee.employee_id);
            await request.input("employee_name", sql.VarChar(50), targetEmployee.name);
            await request.input("requestor_name", sql.VarChar(50), requestor.name);
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

                UPDATE Ticket
                SET
                    status = 2
                WHERE
                    ticket_num = @ticket_num;
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

router.post("/get_comments", async (req, res) => {
    /*
        source = {
            ticketNum: int
        }
    */

    let responseJSON = {
        success: "",
        error: "",
        comments: []
    }

    if (req.session.loggedIn) {
        let requestSql = new sql.Request()

        try {
            await requestSql.input("ticket_num", sql.Int, req.body.ticketNum);

            let responseSql = await requestSql.query("SELECT * FROM Comment WHERE ticket_num = @ticket_num");

            if (responseSql.recordset.length > 0) {
                responseJSON = { ...responseJSON, success: "yes", comments: responseSql.recordset }
            }
        } catch (err) {
            responseJSON = { ...responseJSON, success: "no", error: err }
        }
    } else {
        responseJSON = { ...responseJSON, success: "no", error: "Must be logged in to getComments" }
    }
    console.log("body: ", req.body);
    console.log("Response: ", responseJSON);
    res.send(responseJSON);
})

router.post("/set_in_progress", async (req, res) => {

})

router.post("/add_comment", async (req, res) => {
    /* 
        input = {
            ticket_num: int,
            employee_id: int
            content: str,
            employee_name: str
        }
    */

    let responseJSON = {
        success: "",
        error: "",
    }

    let request = new sql.Request()

    if (req.session.loggedIn) {
        try {
            await request.input("ticket_num", sql.Int, req.body.ticket_num);
            await request.input("employee_id", sql.Int, req.body.employee_id);
            await request.input("content", sql.Text, req.body.content);
            await request.input("employee_name", sql.VarChar(50), req.body.employee_name);

            request.query(`INSERT INTO Comment (ticket_num, employee_id, content)
        VALUES (@ticket_num, @employee_id,
        CAST(@employee_name AS VARCHAR) + ' Commented: "' + CAST(@content AS VARCHAR(500)) + '." on: ' + CAST(getdate() AS VARCHAR));`
            );

            responseJSON = { ...responseJSON, success: "yes",}
        } catch (err) {
            responseJSON = { ...responseJSON, success: "no", error: err }
        }
    } else {
        responseJSON = { ...responseJSON, success : "no", error: "Must be logged in to make a comment" }
    }

    res.send(responseJSON);
})

module.exports = router;