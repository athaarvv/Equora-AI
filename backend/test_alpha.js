const axios = require('axios');
axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=da3jhppr01qual4qdiugda3jhppr01qual4qdiv0')
  .then(res => console.log('ALPHA VANTAGE:', Object.keys(res.data), res.data.Information || res.data['Error Message'] || 'Success'))
  .catch(err => console.log('ALPHA VANTAGE ERROR:', err.message));
