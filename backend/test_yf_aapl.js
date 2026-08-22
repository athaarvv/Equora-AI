const yahooFinance = require('yahoo-finance2').default;
yahooFinance.quote('AAPL')
  .then(quote => console.log('YF QUOTE SUCCESS:', quote.regularMarketPrice))
  .catch(err => console.log('YF QUOTE ERROR:', err.message));
yahooFinance.historical('AAPL', { period1: '2025-01-01' })
  .then(hist => console.log('YF HIST SUCCESS:', hist.length))
  .catch(err => console.log('YF HIST ERROR:', err.message));
