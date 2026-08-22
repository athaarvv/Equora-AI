const axios = require('axios');
const token = 'da3jhppr01qual4qdiugda3jhppr01qual4qdiv0';
axios.get(`https://financialmodelingprep.com/api/v3/quote/AAPL?apikey=${token}`)
  .then(res => console.log('FMP SUCCESS:', Object.keys(res.data[0] || {})))
  .catch(err => console.log('FMP ERROR:', err.response?.status, err.response?.data || err.message));
