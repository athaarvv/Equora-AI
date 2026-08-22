const axios = require('axios');
const headers = { 'X-Api-Key': 'sk-live-MhET8eGcAhNsvuiP4p0X5mP2MysuL3NoQYk3Qdjk' };

axios.get('https://indianapi.in/stock?name=TCS', { headers })
  .then(res => console.log('stock success:', Object.keys(res.data)))
  .catch(err => console.log('stock error:', err.response?.status, err.response?.data || err.message));

axios.get('https://indianapi.in/historical_data?stock_name=TATAMOTORS&period=1yr&filter=price', { headers })
  .then(res => console.log('hist success:', Object.keys(res.data)))
  .catch(err => console.log('hist error:', err.response?.status, err.response?.data || err.message));
