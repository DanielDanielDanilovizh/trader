
export type Stock = {
  symbol: string;
  name: string;
  currency: string;
  country: string;
};

export type StocksJson = { data: Stock[] };
