const axios = require('axios');
const headers = { 'X-Api-Key': 'sk-live-MhET8eGcAhNsvuiP4p0X5mP2MysuL3NoQYk3Qdjk' };
const urls = [
  'https://indianapi.in/stock?name=TCS',
  'https://indianapi.in/historical_data?stock_name=TCS&period=1yr&filter=price',
  'https://indianapi.in/api/v1/stock?name=TCS',
];
urls.forEach(url => {
  axios.get(url, { headers })
    .then(res => {
      console.log(url, 'SUCCESS', Object.keys(res.data));
    })
    .catch(err => {
      console.log(url, 'ERROR', err.response ? err.response.status : err.message);
    });
});
