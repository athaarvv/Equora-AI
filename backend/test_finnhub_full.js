const axios = require('axios');
axios.get('https://finnhub.io/api/v1/quote?symbol=AAPL&token=da3jhppr01qual4qdiugda3jhppr01qual4qdiv0')
  .then(res => console.log('FINNHUB SUCCESS FULL:', res.data))
  .catch(err => console.log('FINNHUB ERROR FULL:', err.response?.status, err.message));
