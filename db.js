const sql = require("mssql");
require("dotenv").config();

config = `Server=tcp:testappdatabase.database.windows.net,1433;Database=testappdb;Uid=testappAdmin;Pwd=${process.env.AZURE_SQL_PASSWORD};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=120;`;
module.exports = {
    connect: () => {
        console.log(config);
        sql.connect(config)
    },
    sql,
    config,
};