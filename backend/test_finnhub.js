const axios = require('axios');
axios.get('https://finnhub.io/api/v1/quote?symbol=AAPL&token=da3jhppr01qual4qdiug')
  .then(res => console.log('FINNHUB SUCCESS 1:', res.data))
  .catch(err => console.log('FINNHUB ERROR 1:', err.response?.status, err.message));

axios.get('https://finnhub.io/api/v1/quote?symbol=AAPL&token=da3jhppr01qual4qdiv0')
  .then(res => console.log('FINNHUB SUCCESS 2:', res.data))
  .catch(err => console.log('FINNHUB ERROR 2:', err.response?.status, err.message));
