var express = require('express');
var router = express.Router();
const sql = require("mssql");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const session = require("express-session");


/* GET users listing. */
router.get('/test', async function (req, res) {
  let request = new sql.Request();
  let response = await request.query("SELECT * FROM test");
  res.send(response);
});

router.get("/departments", async function (req, res) {
  let request = new sql.Request();
  let response = await request.query("SELECT * FROM Department");

  res.send(response.recordset);
})

router.get("/get_techs", async function (req, res) {
  let request = new sql.Request();
  class Tech {
    constructor(username, name, id, tickets){
      this.username = username;
      this.name = name;
      this.tickets = tickets;
      this.id = id;
    }
  }

  let response = {
    techs: [],
    success: "",
    error: ""
  }

  if(req.session.loggedIn){
    try {
      let queryResponse = await request.query(`SELECT * FROM [User] u LEFT JOIN
      Ticket_Assignment ta on u.employee_id = ta.employee_id
      WHERE u.type = 3`);
      queryResponse.recordset.forEach(record => {

        console.log("Record: ", record);
        console.log(response.techs);
        // Find if the tech already exists in the response.techs array
        let existingTech = response.techs.find(tech => tech.id === record.employee_id[0]);
        if (existingTech) {
          // If the tech exists, just add the ticket number to their tickets array (if it's not null)
          if (record.ticket_num) {
            existingTech.tickets.push(record.ticket_num);
          }
        } else {
          // If the tech doesn't exist, create a new Tech object and add it to the response.techs array
          let newTech = new Tech(record.username, record.name, record.employee_id[0], record.ticket_num ? [record.ticket_num] : []);
          response.techs.push(newTech);
        }
      });
      response.success = "yes";
    } catch (err) {
      response.success = "no";
      response.error = err;
    }
  } else {
    response.success = "no";
    response.error = "Must be logged in to get techs";
  }

  res.send(response);
})


router.post("/create", async function (req, res) {
  console.log(req.body);
  try {
    if (req.session.loggedIn) {
      /*
        Expected JSON  **Types probably don't matter cause I think JSON auto converts to str**
        {
          username: "", str
          password: "", str *MIGHT RUN ENCRYPTION ON CLIENT* ??DOUBLE ENCRYPT??
          dep_num: "", int
          name: "", str
          type: "", int
          callback: ""
        }
      */

      /*
        Return JSON
        {
          sucess: "yes", "no", **Will be a string of yes or no corresponding to created or not
          id: "", Will contain employee ID if created
          error: "" If unable to create account explain why
        }
      */

      //console.log(await bcrypt.hash(req.body.password, 10));

      let returnJson = {
        sucess: "",
        error: ""
      }
      let result;
      let hash;

      //Check for username already in use

      let genericError = false;
      let request = new sql.Request();
      try { //Attempt to fill in all variables in the Querry. offers input sanitization
        request.input('username', sql.VarChar(50), req.body.username);
        request.input("password", sql.Text, await bcrypt.hash(req.body.password, 10));
        request.input('dep_num', sql.Int, req.body.dep_num);
        request.input("name", sql.VarChar(50), req.body.name);
        request.input("type", sql.TinyInt, req.body.type);
        if (req.body.callback == "") {
          let _ = await request.query("SELECT callback FROM Department WHERE dep_id = @dep_num")
          console.log(_.recordset[0]);
          req.body.callback = parseInt(_.recordset[0].callback);
        }
        request.input("callback", sql.BigInt, req.body.callback);
        result = await request.query("Select * FROM [User] WHERE username = @username"); //Check for duplicate username
        //console.log(result);
      }
      catch (err) {
        returnJson = {
          ...returnJson,
          sucess: "no",
          error: "Query failed for unknown reason" //Query failed to run. No return value
        }
        genericError = true;
        console.log(err);
      } try { //In a try block because if stateent can fail
        if ((result.recordset.length > 0)) { // If 1 or more usernames return give no success
          returnJson = {
            ...returnJson,
            sucess: "no",
            error: "User already has an account"
          }
          genericError = true
        }
      } catch (err) {
        returnJson = {  //If statement failed to run likely due to query returning an error. In testing this was usually
          //a bad data type overflowing the buffer
          ...returnJson,
          sucess: "no",
          error: "Query failed for unknown reason. Most likely bad data type"
        }
        genericError = true;
        //console.log(err);
      }

      //Assuming none of the above failed lets add the user to the DB
      if (!genericError) {
        try {
          result = await request.query("INSERT INTO [USER] (def_callback, username, password, dep_num, name, type) VALUES (@callback, @username, @password, @dep_num, @name, @type);");
          //console.log("Second Result: ", result);
        } catch (error) {
          //console.log(error);
          returnJson = {
            ...returnJson,
            sucess: "no",
            error: "Insert failed for unknown reason"
          }
          genericError = true;
        }
        if (!genericError) {
          returnJson = {
            ...returnJson,
            success: "yes",
          }
        }
      }

      res.send(returnJson);

      /*
        Return JSON
        {
          sucess: "yes", "no", **Will be a string of yes or no corresponding to created or not
          id: "", Will contain employee ID if created
          error: "" If unable to create account explain why
        }
      */
    } else {
      res.send({
        sucess: "no",
        error: "Please log in"
      });
    }
  } catch {
    res.send({
      sucess: "no",
      error: "Generic in larger try"
    });
  }
});

router.post("/login", async (req, res) => {
  /*
    Expected JSON  **Types probably don't matter cause I think JSON auto converts to str**
    {
      username: "", str
      password: "", str
    }
  */
  let genericError = false;
  let request = new sql.Request();
  let resultUser;
  try { //Attempt to fill in all variables in the Querry. offers input sanitization
    request.input('username', sql.VarChar(50), req.body.username);
    result = await request.query("Select * FROM [User] WHERE username = @username");
    resultUser = result.recordset[0];
  } catch (err) {
    genericError = true;
    console.log(err);
  }
  try {
    if (await bcrypt.compare(req.body.password, resultUser.password)) {
      console.log((bcrypt.compare(resultUser.password, req.body.password)))
      req.session.employee = resultUser;
      req.session.loggedIn = true;
      console.log("logged in successfully???")
    }
    else {
      genericError = true
    }
  } catch (err) {
    console.log(err, "\n\nsomething failed in second try");
    genericError = true;
  }

  if (genericError) {
    res.send({
      success: false,
      user: {}
    });
    console.log("NotLoggedIn");
  } else {


    res.send({
      success: true,
      user: {
        username: resultUser.username,
        name: resultUser.name,
        type: resultUser.type,
        id: resultUser.employee_id
      }
    });
    console.log("LoggedIn")

  }
})

router.post("/reset_pass", async (req, res) => {

  /*
  Expected JSON  **Types probably don't matter cause I think JSON auto converts to str**
  {
    username: "", str
    password: "", str
  }
  */

  let genericError = false;

  let response = {
    success: "",
    error: ""
  }

  let resultEmployee;
  let request;

  try {
    if ((req.session.employee.username != req.body.username) && req.body.username != "") {
      request = new sql.Request();
      request.input('username', sql.VarChar(50), req.body.username.toLowerCase());
      result = await request.query("Select * FROM [User] WHERE username = @username");
      resultEmployee = result.recordset[0];
    } else if ((req.session.employee.username == req.body.username)) {
      resultEmployee = req.session.employee;
    }
  } catch (err) {
    genericError = true;
    response = {
      ...response,
      success: "no",
      error: "Failed to get user. Most likely this user does not exist."
    }
    console.log(err);
  }

  if (!genericError) {
    if (req.session.loggedIn) {
      if ((req.session.employee.type > 2) || (req.session.employee.username.toLowerCase() == req.body.username.toLowerCase())) {
        request = new sql.Request();
        request.input('employee_id', sql.Int(50), resultEmployee.employee_id);
        request.input('username', sql.VarChar(50), req.body.username.toLowerCase());
        request.input("password", sql.Text, await bcrypt.hash(req.body.password, 10));
        result = await request.query("Update [User] SET password = @password WHERE employee_id = @employee_id"); //Update the user Table, Set password to new password where employee_id matches
        console.log(result);
        response = {
          ...response,
          success: "yes",
        }
      } else {
        console.log("Access level not high enough");
        genericError = true;
        response = {
          ...response,
          success: "no",
          error: "Access level not high enough please contact a higher level admin"
        }
      }
    } else {
      //This would be where we would put a 2fa for a user to reset their own password... If we had one
      //for now just going to resturn contact admin for password reset
      response = {
        ...response,
        success: "no",
        error: "Please reach out to admin for password reset. We do not support self service at this time"
      }
    }
  }


  /*
    {
      success: "",
      error: ""
    }
  */

  res.send(response);
})



router.post("/logout", async (req, res) => {
  /*
    {
      username: ""
    }
  */

  try {
    req.session.destroy();
    res.send({
      success: "yes",
      error: ""
    });
  } catch (err) {
    console.log(err);
    res.send({
      success: "no",
      error: err
    });
  }
})

router.post("/get_profile", async (req, res) => {

  let request = new sql.Request();
  class Profile {
    constructor(username, name, employeeID, phoneNumber, departmentNumber){
      this.username = username;
      this.name = name;
      this.employeeID = employeeID;
      this.phoneNumber = phoneNumber;
      this.departmentNumber = departmentNumber;
    }
  }

  let response = {
    profile: [],
    success: "",
    error: ""
  }
  
  try {
    // you will need to see how to load the username variable from req.body use the other routes as an example
    requestSQL.input('username', sql.VarChar(50), req.body.username);
    let result = await requestSQL.query("select * from [User] where username = @username");
    let user = result.recordset[0];
    res.send(user);
  } catch (err) {
    // some error handling probably a res. Send and some error object
    res.send({
      success: "no",
      error: err.message
    });
  }
});

router.get("/test_session", async (req, res) => {
  res.send("Not currently set up");
})

module.exports = router;
