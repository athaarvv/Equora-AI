const axios = require('axios');
axios.get('https://indianapi.in/api/v1/stock?name=TCS').then(res => console.log(res.status)).catch(err => console.log(err.message));
axios.get('https://api.indianapi.in/v1/stock?name=TCS').then(res => console.log(res.status)).catch(err => console.log(err.message));
axios.get('https://indianapi.in/stock?name=TCS').then(res => console.log(res.status)).catch(err => console.log(err.message));
