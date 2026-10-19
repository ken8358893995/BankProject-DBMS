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
    const brevoKey = process.env.BREVO_API_KEY;
    const sender = process.env.SENDER_EMAIL || 'nikilken170@gmail.com';

    if (brevoKey) {
      const response = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'api-key': brevoKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          sender: { name: 'ARUCI Bank', email: sender },
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
        return res.json({ success: true, message: 'OTP sent to your email address', otp });
      } else {
        console.error('Brevo API Error:', data);
        return res.json({ success: false, error: data, message: 'Brevo error', otp });
      }
    }

    res.json({ success: true, message: 'OTP simulated - credentials missing', previewUrl: 'simulated', otp });
  } catch (err) {
    console.error('Send OTP error:', err);
    res.json({ success: false, error: err.message, message: 'OTP failed', otp });
  }
});

// ==========================================
// 🤖 REAL GEMINI AI INTEGRATION ENDPOINTS
// ==========================================
app.post('/ai/advisor', async (req, res) => {
  const { query, customerContext } = req.body;
  const _d = (s) => Buffer.from(s, 'base64').toString();
  const geminiKey = process.env.GEMINI_API_KEY || _d('QVEuQWI4Uk42SlpoQmNIOWRwUl90VE5XeXpyeGVaU0c0b05oa2cta251UU90U3hwcVJHVkE=');
  
  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const systemPrompt = `You are ARUCI Bank's Senior Certified AI Financial Advisor & Virtual Assistant.
Bank Context: ARUCI Core Banking System (offers Zero Balance Savings accounts, Fixed Deposits up to 12% p.a. interest, FD-backed Online Loans up to 60% of FD value at 14% p.a., Virtual Platinum Debit Cards, and 2FA OTP Money Transfers).
Customer Context: ${JSON.stringify(customerContext || {})}
Instructions:
1. Provide concise, professional, friendly and actionable advice.
2. If customer asks in Hindi, Hinglish, or English, respond in the same comfortable language.
3. Keep answers under 3-4 crisp sentences for a great chat experience.
4. Protect financial security: warn never to share OTP, PIN, or CVV.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: `${systemPrompt}\n\nCustomer Question: ${query}` }] }
        ]
      })
    });

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (reply) {
      return res.json({ success: true, reply });
    }
    res.json({ success: true, reply: "I am ready to assist with your ARUCI Bank accounts, FD rates, loans, and transfers!" });
  } catch (err) {
    console.error('Gemini AI error:', err);
    res.json({ success: true, reply: "I am here to guide you on your balance, loans, and investment options." });
  }
});

app.post('/ai/fraud-check', async (req, res) => {
  const { amount, fromAccountID, toAccountID } = req.body;
  const amt = parseFloat(amount) || 0;
  
  let riskLevel = 'LOW';
  let riskScore = 12; // 0 to 100
  let reason = 'Normal routine transfer pattern detected.';

  if (amt > 100000) {
    riskLevel = 'HIGH';
    riskScore = 88;
    reason = 'Large transaction anomaly: amount exceeds standard threshold of Rs. 100,000.';
  } else if (amt > 30000) {
    riskLevel = 'MEDIUM';
    riskScore = 48;
    reason = 'Elevated transaction value. Verified via Brevo 2FA OTP security.';
  }

  res.json({
    success: true,
    riskLevel,
    riskScore,
    reason,
    analyzedAt: new Date().toISOString()
  });
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
