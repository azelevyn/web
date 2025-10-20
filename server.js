require('dotenv').config();
const express = require('express');
const cors = require('cors');
const CoinPayments = require('coinpayments');

// --- SERVER AND API INITIALIZATION ---

// Check for essential environment variables
if (!process.env.COINPAYMENTS_PUBLIC_KEY || !process.env.COINPAYMENTS_PRIVATE_KEY) {
    console.error("FATAL ERROR: Missing required CoinPayments environment variables in .env file.");
    process.exit(1);
}

// Initialize CoinPayments Client
const coinpayments = new CoinPayments({
    key: process.env.COINPAYMENTS_PUBLIC_KEY,
    secret: process.env.COINPAYMENTS_PRIVATE_KEY,
});

const app = express();
const port = 3000;

// Middleware
app.use(cors()); // Allows requests from your frontend
app.use(express.json()); // Parses incoming JSON requests

// --- API ENDPOINT ---

app.post('/api/create-transaction', async (req, res) => {
    const { amount, fiat, network, paymentMethod, paymentDetails } = req.body;

    // Basic validation
    if (!amount || !fiat || !network || !paymentMethod || !paymentDetails) {
        return res.status(400).json({ error: 'Missing required transaction details.' });
    }

    try {
        const networkMap = {
            'TRC20': 'USDT.TRC20',
            'ERC20': 'USDT.ERC20'
        };
        const coinCurrency = networkMap[network];

        if (!coinCurrency) {
            return res.status(400).json({ error: 'Invalid network selected.' });
        }

        const transactionOptions = {
            currency1: 'USDT',
            currency2: coinCurrency,
            amount: amount,
            buyer_email: 'azelchillexa@gmail.com', // Your refund email
            custom: `Payout to ${paymentMethod}: ${paymentDetails}`,
            item_name: `Sell ${amount} USDT for ${fiat}`,
            ipn_url: 'YOUR_IPN_WEBHOOK_URL' // Optional: for server-to-server notifications
        };

        const result = await coinpayments.createTransaction(transactionOptions);
        res.status(200).json(result);

    } catch (error) {
        console.error("CoinPayments API Error:", error.message);
        res.status(500).json({ error: 'An error occurred with the payment provider. Please try again later.' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`✅ Secure backend server running at http://localhost:${port}`);
});
