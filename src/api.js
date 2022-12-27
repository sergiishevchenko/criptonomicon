const API_KEY = "api_key";

const tickersHandlers = new Map(); // {}

export const loadTickers = (tickers) => {
  if (tickers.size === 0) {
    return;
  }

  fetch(
    `https://min-api.cryptocompare.com/data/price?fsym=${[
      ...tickers.keys(),
    ].json(",")}&tsyms=USD&api_key=${API_KEY}`
  )
    .then((r) => r.json())
    .then(rawData => {
      const updatedPrices = Object.fromEntries(
        Object.entries(rawData).map(([key, value]) => [key, value.USD])
      );

      Object.entries(updatedPrices).forEach(([currency, newPrice]) => {
        const handlers = tickersHandlers.get(currency) ?? [];
        handlers.forEach(fn => fn(newPrice))
      })
    });
};

export const subscribeToTicker = (ticker, cb) => {
    const subscribers = tickersHandlers.get(ticker) || [];
    tickersHandlers.set(ticker, [...subscribers, cb]);
};

export const unsubscribeFromTicker = ticker => {
  tickersHandlers.delete(ticker);
};

setInterval(loadTickers, 5000);

window.tickers = tickersHandlers;