const yf = require('yahoo-finance2');
console.log(Object.keys(yf));
console.log(Object.keys(yf.default || {}));
console.log(typeof yf.YahooFinance);
