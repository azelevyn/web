// server.js
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const CoinPayments = require('coinpayments');

const app = express();
app.use(bodyParser.json());

// Initialize CoinPayments client
const coinpayments = new CoinPayments({
    key: process.env.COINPAYMENTS_PUBLIC_KEY,
    secret: process.env.COINPAYMENTS_PRIVATE_KEY,
});

// Your existing function to generate transaction
async function createTransaction(userData) {
    const { fiat, network, amount, paymentMethod, paymentDetails } = userData;

    // Map network to CoinPayments currency code
    const networkMap = {
        'TRC20': 'USDT.TRC20',
        'ERC20': 'USDT.ERC20',
    };
    const coinCurrency = networkMap[network] || 'USDT.ERC20';

    const transactionOptions = {
        currency1: 'USDT',
        currency2: coinCurrency,
        amount: amount,
        buyer_email: process.env.BUYER_REFUND_EMAIL,
        custom: `Payout to ${paymentMethod}: ${paymentDetails}`,
        item_name: `Sell ${amount} USDT for ${fiat}`,
        ipn_url: 'YOUR_IPN_WEBHOOK_URL', // replace with your webhook URL if needed
    };

    // Call CoinPayments API
    const result = await coinpayments.createTransaction(transactionOptions);
    return {
        address: result.address,
        amount: result.amount,
        txn_id: result.txn_id,
        status_url: result.status_url,
    };
}

// API route
app.post('/api/create-transaction', async (req, res) => {
    try {
        const result = await createTransaction(req.body);
        res.json(result);
    } catch (err) {
        console.error('Error creating transaction:', err);
        res.status(500).json({ error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API server listening on port ${PORT}`);
});
