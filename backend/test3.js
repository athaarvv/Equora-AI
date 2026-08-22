const yf = require('yahoo-finance2').default;
try {
  yf.quote('AAPL').then(console.log).catch(e => console.log('Promise caught:', e.message));
} catch(e) {
  console.log('Catch:', e.message);
}
