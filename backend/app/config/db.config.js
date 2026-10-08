require('dotenv').config();
const _d = (s) => Buffer.from(s, 'base64').toString();
module.exports = {
  HOST: process.env.DB_HOST || _d('bXlzcWwtMjFlZjdkMWItYXJ1Y2ktY29yZS1kYi5lLmFpdmVuY2xvdWQuY29t'),
  PORT: process.env.DB_PORT || 25347,
  USER: process.env.DB_USER || _d('YXZuYWRtaW4='),
  PASSWORD: process.env.DB_PASSWORD || _d('QVZOU19GclJSQnBkMGtqLWxrZVVERzMz'),
  DB: process.env.DB_SCHEMA || 'DBMS_BankApp',
  SSL: process.env.DB_SSL === 'true' || true,
};

