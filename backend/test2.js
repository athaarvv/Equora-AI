const yf = require('yahoo-finance2').default;
const instance = yf; // Wait, maybe yf is a function? Let's check keys
console.log(Object.keys(yf));
console.log(typeof yf.quote);
