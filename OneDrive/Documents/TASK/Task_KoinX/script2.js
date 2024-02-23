const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const cron = require('node-cron');
const { createLogger, transports, format } = require('winston');

const app = express();
app.use(express.json());


mongoose.connect('mongodb+srv://ganeshpatakamuri:pGoSSFQH8BEIXbZB@cluster0.npn5qg5.mongodb.net/crypto', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


const Crypto = mongoose.model('Crypto', {
  id: String,
  name: String,
});


const HistoricalPrice = mongoose.model('HistoricalPrice', {
  fromCurrency: String,
  toCurrency: String,
  date: Date,
  price: Number,
});

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.simple()
  ),
  transports: [
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

/* Task 1: Fetch and store cryptocurrency list */
async function updateCryptos() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
    const cryptos = response.data.map(crypto => ({
      id: crypto.id,
      name: crypto.name,
    }));
    await Crypto.deleteMany({});
    await Crypto.insertMany(cryptos);
    logger.info('Cryptocurrency list updated.');
  } catch (error) {
    logger.error('Error updating cryptocurrency list:', error.message);
  }
}

cron.schedule('0 * * * *', updateCryptos);

/* Task 2: API endpoint to fetch historical price for two cryptocurrencies*/
app.post('/historicalPrice', async (req, res) => {
  const { fromCurrency, toCurrency, date } = req.body;
  try {
    const response = await axios.get(`https://api.coingecko.com/api/v3/coins/${fromCurrency}/history?date=${date}`);
    const priceData = response.data.market_data.current_price;
    const price = priceData[toCurrency.toLowerCase()];
    const historicalPrice = new HistoricalPrice({
      fromCurrency,
      toCurrency,
      date: new Date(date),
      price,
    });
    await historicalPrice.save();

    res.json({ price });
  } catch (error) {
    logger.error('Error fetching historical price:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


/* Task 3: API endpoint to get companies holding a cryptocurrency */
app.get('/companies', async (req, res) => {
  const { currency } = req.query;
  try {
    let apiUrl;
    if (currency === 'bitcoin' || currency === 'ethereum') {
      apiUrl = `https://api.coingecko.com/api/v3/companies/public_treasury/${currency}`;
    } else {
      return res.status(400).json({ error: 'Invalid currency' });
    }

    const response = await axios.get(apiUrl);
    const companies = response.data;
    res.json({ companies });
  } catch (error) {
    logger.error('Error fetching companies:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
  logger.info(`Server started on port ${PORT}`);
});

updateCryptos();
