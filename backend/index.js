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
    const apiKey = process.env.EMAIL_PASS;
    if (apiKey) {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'ARUCI Bank', email: 'nikilken170@gmail.com' },
          to: [{ email: email }],
          subject: 'Your OTP for Fund Transfer - ARUCI Bank',
          htmlContent: `
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
        })
      });

      const data = await response.json();
      console.log('Brevo API Result:', data);

      if (response.ok && data.messageId) {
        return res.json({ success: true, message: 'OTP sent successfully to email', otp });
      } else {
        console.error('Brevo API Error:', data);
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
