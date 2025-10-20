// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const CoinPayments = require('coinpayments');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ================================
// 🔐 CONFIGURATION
// ================================
const PORT = process.env.PORT || 3000;

// CoinPayments credentials
const client = new CoinPayments({
  key: process.env.COINPAYMENTS_PUBLIC_KEY,
  secret: process.env.COINPAYMENTS_PRIVATE_KEY,
});

// ================================
// ⚙️ TEST ROUTE
// ================================
app.get('/', (req, res) => {
  res.json({ message: '✅ USDT Exchange Mini App Backend is running!' });
});

// ================================
// 💰 CREATE TRANSACTION API
// ================================
app.post('/api/create-transaction', async (req, res) => {
  try {
    const { amount, network } = req.body;

    if (!amount || !network) {
      return res.status(400).json({ error: 'Missing required fields: amount or network' });
    }

    console.log('📥 Request received:', req.body);

    const currency = 'USDT';
    const buyer_email = 'azelchillexa@gmail.com'; // your refund email

    const options = {
      currency1: 'USDT',
      currency2: currency,
      amount: parseFloat(amount),
      buyer_email: buyer_email,
      ipn_url: process.env.IPN_URL || 'https://yourdomain.com/ipn',
      success_url: process.env.SUCCESS_URL || 'https://yourdomain.com/success',
      cancel_url: process.env.CANCEL_URL || 'https://yourdomain.com/cancel',
      item_name: `USDT Sell Transaction (${network})`,
    };

    const result = await client.createTransaction(options);
    console.log('✅ Transaction created:', result);

    return res.json({
      amount: result.amount,
      address: result.address,
      txn_id: result.txn_id,
      confirms_needed: result.confirms_needed,
      status_url: result.status_url,
    });
  } catch (err) {
    console.error('❌ Error creating transaction:', err.message);
    return res.status(500).json({ error: err.message });
  }
});

// ================================
// 🟢 START SERVER
// ================================
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
