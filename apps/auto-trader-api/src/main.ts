import express from 'express';
import stocks from './assets/stocks.json';

import type {StocksJson } from '@auto-trader/types'; // Adjust the import path as necessary
import cors from 'cors';

const stocksTyped = stocks as StocksJson;

const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();
app.use(cors());

app.get('/stocks', (req, res) => {
  try {
    const filtered = stocksTyped.data.map((s) => ({
      symbol: s.symbol,
      name: s.name,
      currency: s.currency,
      country: s.country,
    }));
    res.json(filtered);
  } catch (parseError) {
    console.error('Failed to process stock data:', parseError);
    res.status(500).json({ message: 'Data format error' });
  }
});

app.get('/stocks/search', (req, res) => {
  const q = (req.query.q as string)?.toLowerCase() || '';
  if (!q || q.length < 2) {
    return res.json([]); // Require at least 2 characters for search
  }
  try {
    const results = stocksTyped.data
      .filter(
        (s) =>
          s.symbol.toLowerCase().includes(q) ||
          s.name.toLowerCase().includes(q) ||
          s.currency.toLowerCase().includes(q) ||
          s.country.toLowerCase().includes(q)
      )
      .slice(0, 20)
      .map((s) => ({
        symbol: s.symbol,
        name: s.name,
        currency: s.currency,
        country: s.country,
      }));
    res.json(results);
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(port, host, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});


