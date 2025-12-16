const mysql = require("mysql2/promise");
require("dotenv").config({ path: "../backend/.env" });

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "mental_diary",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  dateStrings: true,
});

console.log(
  `[DB DIAGNOSIS] Connecting as: ${process.env.DB_USER}, PW Length: ${process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0}`
);
console.log(`[DB DIAGNOSIS] Is PW set? ${!!process.env.DB_PASSWORD}`);

pool
  .getConnection()
  .then((connection) => {
    console.log("✅ Connected to MySQL database:", process.env.DB_NAME);
    connection.release();
  })
  .catch((err) => {
    console.error("❌ Failed to connect to MySQL:", err.message);
  });

module.exports = pool;
