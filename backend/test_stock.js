const axios = require('axios');
const headers = { 'X-Api-Key': 'sk-live-MhET8eGcAhNsvuiP4p0X5mP2MysuL3NoQYk3Qdjk' };
axios.get('https://stock.indianapi.in/stock?name=TCS', { headers })
  .then(res => console.log('SUCCESS', Object.keys(res.data)))
  .catch(err => console.log('ERROR', err.response ? err.response.status : err.message));

axios.get('https://stock.indianapi.in/historical_data?stock_name=TCS&period=1yr&filter=price', { headers })
  .then(res => console.log('HIST SUCCESS', Object.keys(res.data)))
  .catch(err => console.log('HIST ERROR', err.response ? err.response.status : err.message));
