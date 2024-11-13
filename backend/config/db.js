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

config/db.js
// const mysql = require('mysql2/promise');

// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'your_username',
//   password: 'your_password',
//   database: 'your_database',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

// // Test the connection
// pool.getConnection()
//   .then(connection => {
//     console.log('Database connected successfully');
//     connection.release();
//   })
//   .catch(err => {
//     console.error('Error connecting to the database:', err);
//   });

// module.exports = pool;
