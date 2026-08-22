const axios = require('axios');
axios.get('http://localhost:5000/api/market/history/AAPL?period=1D').then(res => console.log('Length:', res.data.length, 'Data:', res.data[0])).catch(err => console.log(err.message));
