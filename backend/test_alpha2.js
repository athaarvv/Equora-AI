const axios = require('axios');
axios.get('https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=AAPL&apikey=123')
  .then(res => console.log('ALPHA VANTAGE 123:', Object.keys(res.data), res.data.Information || res.data['Error Message'] || 'Success'))
  .catch(err => console.log('ALPHA VANTAGE ERROR:', err.message));
