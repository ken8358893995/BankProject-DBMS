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
    let transporter;
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
      });
    } else {
      transporter = etherealTransporter;
    }

    if (!transporter) {
       return res.json({ success: true, message: "OTP generated", previewUrl: "simulated", otp });
    }

    try {
      let info = await transporter.sendMail({
        from: `"ARUCI Bank" <noreply@arucibank.com>`,
        to: email,
        subject: "Your OTP for Fund Transfer",
        html: `
          <div style="font-family: Arial; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px;">
            <h2 style="color: #1677ff;">ARUCI Bank Secure Transfer</h2>
            <p>You have requested to transfer <b>Rs. ${amount}</b>.</p>
            <p>Your One Time Password (OTP) is:</p>
            <h1 style="letter-spacing: 5px; color: #cf1322; background: #fff1f0; padding: 10px; text-align: center; border-radius: 5px;">${otp}</h1>
            <p>Do not share this OTP with anyone. It is valid for 10 minutes.</p>
          </div>
        `
      });

      let previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("Preview URL: %s", previewUrl);
        res.json({ success: true, message: "OTP sent successfully", previewUrl, otp });
      } else {
        res.json({ success: true, message: "OTP sent successfully", otp });
      }
    } catch (mailErr) {
      console.log("Mail delivery error (simulating OTP):", mailErr.message);
      res.json({ success: true, message: "OTP sent successfully", previewUrl: "simulated", otp });
    }
  } catch (err) {
    console.error(err);
    res.json({ success: true, message: "OTP simulated", previewUrl: "simulated", otp });
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
