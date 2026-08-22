import { YahooFinance } from 'yahoo-finance2';
const yf = new YahooFinance();

async function run() {
    try {
        const quote = await yf.quote('AAPL');
        console.log(quote.regularMarketPrice);
        
        const end = new Date();
        const start = new Date();
        start.setDate(start.getDate() - 2); 
        const result = await yf.chart('TCS.NS', { period1: start.toISOString(), period2: end.toISOString(), interval: '5m' });
        console.log('Quotes length:', result.quotes.length);
        console.log('First quote:', result.quotes[0]);
    } catch (e: any) {
        console.log('Error:', e.message);
    }
}
run();
