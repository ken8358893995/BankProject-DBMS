require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow all origins or requests with no origin (e.g. mobile apps, curl)
      callback(null, true);
    },
    credentials: true,
  })
);

require('./app/routes/customer.routes')(app);
require('./app/routes/fd.routes')(app);

app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date() });
});
require('./app/routes/account.routes')(app);
require('./app/routes/physicalloan.routes')(app);
require('./app/routes/onlineloan.routes')(app);
require('./app/routes/transaction.routes')(app);
require('./app/routes/auth.routes')(app);
require('./app/routes/withdrawal.routes')(app);
require('./app/routes/deposit.routes')(app);
require('./app/routes/onlineCustomer.routes')(app);
require('./app/routes/employee.routes')(app);
require('./app/routes/branch.routes')(app);

const nodemailer = require('nodemailer');

let etherealAccount = null;
let etherealTransporter = null;
nodemailer.createTestAccount().then(account => {
  etherealAccount = account;
  etherealTransporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: { user: account.user, pass: account.pass }
  });
  console.log("Ethereal Test Email Account created. All emails will be intercepted for testing.");
}).catch(console.error);

app.post('/send-otp', async (req, res) => {
  const { email, otp, amount } = req.body;
  
  try {
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        host: 'smtp-relay.brevo.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        },
        connectionTimeout: 15000,
        greetingTimeout: 10000,
        socketTimeout: 20000
      });

      try {
        const info = await transporter.sendMail({
          from: `"ARUCI Bank" <nikilken170@gmail.com>`,
          to: email,
          subject: 'Your OTP for Fund Transfer - ARUCI Bank',
          html: `
            <div style="font-family: Arial, sans-serif; padding: 25px; border: 1px solid #e0e0e0; border-radius: 12px; max-width: 500px; margin: auto;">
              <h2 style="color: #1677ff; margin-top: 0;">ARUCI Bank Secure Transfer</h2>
              <p style="font-size: 15px; color: #333;">You have requested to transfer <b>Rs. ${amount}</b>.</p>
              <p style="color: #555;">Your One Time Password (OTP) is:</p>
              <div style="letter-spacing: 6px; color: #cf1322; background: #fff1f0; padding: 14px; text-align: center; border-radius: 8px; font-size: 32px; font-weight: bold; border: 1px dashed #ffa39e;">
                ${otp}
              </div>
              <p style="color: #888; font-size: 13px; margin-top: 20px;">Do not share this OTP with anyone. It is valid for 10 minutes.</p>
            </div>
          `
        });

        console.log('Real Email Sent! ID:', info.messageId);
        return res.json({ success: true, message: 'OTP sent to your email address', otp });
      } catch (mailErr) {
        console.error('Mail send error:', mailErr.message);
      }
    }

    res.json({ success: true, message: 'OTP simulated', previewUrl: 'simulated', otp });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.json({ success: true, message: 'OTP simulated', previewUrl: 'simulated', otp });
  }
});
const db = require('./app/models/db.js');

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}.`);
  db.getConnection((err, connection) => {
    if (err) {
      console.error('❌ Database connection failed:', err.message);
    } else {
      console.log('✅ Successfully connected to the MySQL Database (Laragon).');
      connection.release();
    }
  });
});
