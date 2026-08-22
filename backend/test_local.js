const axios = require('axios');
axios.get('http://localhost:5000/api/market/quote/TCS').then(res => console.log(res.data)).catch(err => console.log(err.message));
