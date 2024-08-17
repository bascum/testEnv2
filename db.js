const sql = require("mssql");
require("dotenv").config();

config = `Server=tcp:testappdatabase.database.windows.net,1433;Database=testappdb;Uid=testappAdmin;Pwd=${process.env.AZURE_SQL_PASSWORD};Encrypt=yes;TrustServerCertificate=no;Connection Timeout=30;`

module.exports = {
    connect: () => sql.connect(config),
    sql,
};