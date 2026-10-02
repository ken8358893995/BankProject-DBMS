const mysql = require('mysql2');
const dbConfig = require('../config/db.config.js');

const poolConfig = {
  host: dbConfig.HOST,
  port: parseInt(dbConfig.PORT) || 3306,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  connectionLimit: 10,
};

if (dbConfig.SSL) {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const connection = mysql.createPool(poolConfig);

module.exports = connection;
