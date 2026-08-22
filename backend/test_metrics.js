const axios = require('axios');
const headers = { 'X-Api-Key': 'sk-live-MhET8eGcAhNsvuiP4p0X5mP2MysuL3NoQYk3Qdjk' };
axios.get('https://stock.indianapi.in/historical_data?stock_name=TCS&period=1yr&filter=price', { headers })
  .then(res => {
    if (res.data && res.data.datasets) {
      console.log('Metrics:', res.data.datasets.map(d => d.metric));
    }
  })
  .catch(err => console.log('ERROR', err.message));
