import yfDefault from 'yahoo-finance2';
// Is yfDefault a class?
console.log(typeof yfDefault);
const yf = new (yfDefault as any)();
console.log(typeof yf.quote);
