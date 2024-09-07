var express = require('express');
var router = express.Router();
const sql = require("mssql");


/* GET users listing. */
router.get('/test', async function(req, res) {
  let request = new sql.Request();
  let response = await request.query("SELECT * FROM test");
  res.send(response);
});


router.post("/create", async function(req, res) {
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

  console.log(req.body);

  let returnJson ={
    sucess: "",
    error: ""
  }
  let result;

  //Check for username already in use

  let genericError = false;
  let request = new sql.Request();
  try {
    request.input('username', sql.VarChar(50), req.body.username);
    request.input("password", sql.VarChar(50), req.body.password);
    request.input('dep_num', sql.Int, req.body.dep_num);
    request.input("name", sql.VarChar(50), req.body.name);
    request.input("type", sql.TinyInt, req.body.type);
    request.input("callback", sql.Int, req.body.callback);
    result = await request.query("Select * FROM [User] WHERE username = @username");
    console.log(result);
  }
  catch (err) {
    returnJson = {
      ...returnJson,
      sucess: "no",
      error: "Query failed for unknown reason"
    }
    genericError = true;
    console.log(err);
  }
  if((result.recordset.length > 0)){
    returnJson = {
      ...returnJson,
      sucess: "no",
      error: "User already has an account"
    }
    genericError = true
  }

  //Assuming none of the above failed lets add the user to the DB
  if(!genericError){
    try {
      result = await request.query("INSERT INTO [USER] (def_callback, username, password, dep_num, name, type) VALUES (@callback, @username, @password, @dep_num, @name, @type);");
      console.log("Second Result: ", result);
    } catch (error) {
      console.log(error);
      returnJson = {
        ...returnJson,
        sucess: "no",
        error: "Insert failed for unknown reason"
      }
      genericError = true;
    }
    if(!genericError){
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
});

module.exports = router;
