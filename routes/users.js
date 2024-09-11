var express = require('express');
var router = express.Router();
const sql = require("mssql");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const session = require("express-session");


/* GET users listing. */
router.get('/test', async function (req, res) {
  let request = new sql.Request();
  let response = await request.query("SELECT * FROM test");
  res.send(response);
});


router.post("/create", async function (req, res) {
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
        request.input("callback", sql.Int, req.body.callback);
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
            sucess: "yes",
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
    if (bcrypt.compare(resultUser.password, req.body.password)) {
      req.session.employee = resultUser;
      req.session.loggedIn = true;
    }
    console.log("logged in successfully???")
  } catch (err) {
    console.log(err, "\n\nsomething failed in second try");
    genericError = true;
  }

  if (genericError) {
    res.send(false);
  } else {
    res.send(true);
  }
})

/*router.post("/reset_pass", async (req, res) => {

    /*
    Expected JSON  **Types probably don't matter cause I think JSON auto converts to str**
    {
      username: "", str
      password: "", str
    }
  */ /*
  if(req.session.loggedIn) {
    if (req.session.employee.type > 1) {

    } else {
      let request = new sql.Request();
      let resultUser;
      request.input('username', sql.VarChar(50), req.body.username);
      result = await request.query("Select * FROM [User] WHERE username = @username");

    }
  }
})*/

router.get("/test_session", async (req, res) => {
  res.send("Not currently set up");
})

module.exports = router;
