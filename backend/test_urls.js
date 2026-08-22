const axios = require('axios');
const urls = [
  'https://indianapi.in/api/v1/stock?name=TCS',
  'https://api.indianapi.in/v1/stock?name=TCS',
  'https://indianapi.in/stock?name=TCS',
  'https://api.indianapi.in/stock?name=TCS'
];
urls.forEach(url => {
  axios.get(url)
    .then(res => console.log(url, 'SUCCESS', res.status))
    .catch(err => console.log(url, 'ERROR', err.response ? err.response.status : err.message));
});
