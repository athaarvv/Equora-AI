const axios = require('axios');
const headers = { 'X-Api-Key': 'sk-live-MhET8eGcAhNsvuiP4p0X5mP2MysuL3NoQYk3Qdjk' };
const urls = [
  'https://api.indianapi.in/v1/stock?name=TCS',
  'https://api.indianapi.in/stock?name=TCS',
  'https://api.indianapi.in/v1/historical_data?stock_name=TCS&period=1yr&filter=price',
  'https://api.indianapi.in/historical_data?stock_name=TCS&period=1yr&filter=price'
];
urls.forEach(url => {
  axios.get(url, { headers })
    .then(res => console.log(url, 'SUCCESS', Object.keys(res.data)))
    .catch(err => console.log(url, 'ERROR', err.response ? err.response.status : err.message));
});
