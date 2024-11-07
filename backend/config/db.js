const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'app_user',
  password: process.env.DB_PASSWORD || 'pass',
  database: process.env.DB_NAME || 's8_inprocode',
  port: process.env.DB_PORT || 3306,
});

module.exports = pool.promise();
