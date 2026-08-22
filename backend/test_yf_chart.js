const YF = require('yahoo-finance2').default;
const yf = new YF();

async function test() {
  try {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 2); // 2 days to get enough intraday
    
    const result = await yf.chart('TCS.NS', { period1: start.toISOString(), period2: end.toISOString(), interval: '5m' });
    console.log('Quotes length:', result.quotes.length);
    console.log('First quote:', result.quotes[0]);
  } catch (e) {
    console.log('Error:', e.message);
  }
}
test();
