const axios = require('axios');
const headers = { 'X-Api-Key': 'da3jhppr01qual4qdiugda3jhppr01qual4qdiv0' };
axios.get('https://stock.indianapi.in/stock?name=TCS', { headers })
  .then(res => console.log('INDIAN API SUCCESS:', Object.keys(res.data)))
  .catch(err => console.log('INDIAN API ERROR:', err.response?.status, err.message));
