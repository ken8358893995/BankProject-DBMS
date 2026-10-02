require('dotenv').config();
module.exports = {
  HOST: process.env.DB_HOST || 'localhost',
  PORT: process.env.DB_PORT || 3306,
  USER: process.env.DB_USER || 'root',
  PASSWORD: process.env.DB_PASSWORD || '',
  DB: process.env.DB_SCHEMA || 'DBMS_BankApp',
  SSL: process.env.DB_SSL === 'true',
};

