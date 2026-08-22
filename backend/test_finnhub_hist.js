const axios = require('axios');
const to = Math.floor(Date.now() / 1000);
const from = to - (7 * 24 * 60 * 60); // 7 days ago
axios.get(`https://finnhub.io/api/v1/stock/candle?symbol=AAPL&resolution=D&from=${from}&to=${to}&token=da3jhppr01qual4qdiugda3jhppr01qual4qdiv0`)
  .then(res => console.log('FINNHUB HIST 7D:', Object.keys(res.data)))
  .catch(err => console.log('FINNHUB ERROR HIST 7D:', err.response?.status, err.response?.data || err.message));
