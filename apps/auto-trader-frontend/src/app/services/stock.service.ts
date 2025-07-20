import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, forkJoin } from 'rxjs';
import type { Stock } from '@auto-trader/types';
@Injectable({
  providedIn: 'root',
})
export class StockService {
  // Search stocks by symbol or name using local API
  searchStocks(term: string): Observable<Stock[]> {
    const url = `${this.baseApiUrl}/stocks/search?q=${encodeURIComponent(term)}`;
    return this.http.get<Stock[]>(url);
  }
  private baseDataUrl = 'https://api.twelvedata.com';
  private baseApiUrl = 'http://localhost:3000'; // Local API URL for development
  private apiKey = '6f74580051c64055b7a70ddd4f8748cb'; // 🔁 החלף במפתח שלך
  private http:HttpClient = inject(HttpClient);

  getSymbols(): Observable<string[]> {
    const url = `${this.baseDataUrl}/stocks?source=docs&apikey=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        return response.data.map((item: any) => `${item.symbol} - ${item.name}`);
      })
    );
  }

  getStockTimeSeries(symbol: string): Observable<any> {
    const url = `${this.baseDataUrl}/time_series?symbol=${symbol}&interval=1day&apikey=${this.apiKey}`;
    return this.http.get<any>(url);
  }

  // מחזיר נתוני מחיר יומיים עבור סימול
  getTimeSeries(symbol: string, interval = '1day', outputsize = 30): Observable<any[]> {
    const url = `${this.baseDataUrl}/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(res => res.values.reverse()) // מהחדש לישן
    );
  }

  // מחזיר SMA לפי חלון זמן
  getSMA(symbol: string, interval = '1day', window = 20): Observable<any[]> {
    const url = `${this.baseDataUrl}/sma?symbol=${symbol}&interval=${interval}&window=${window}&outputsize=30&apikey=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(res => res.values.reverse())
    );
  }

  // מחזיר גם מחיר יומי וגם SMA ב־forkJoin
  getPriceAndAverage(symbol: string, smaWindow = 20): Observable<{
    labels: string[],
    price: number[],
    average: (number | null)[]
  }> {
    return forkJoin([
      this.getTimeSeries(symbol),
      this.getSMA(symbol, '1day', smaWindow)
    ]).pipe(
      map(([prices, sma]) => {
        const labels = prices.map(p => p.datetime);
        const priceData = prices.map(p => parseFloat(p.close));

        // התאמת SMA לפי תאריך
        const smaMap = new Map(sma.map(p => [p.datetime, parseFloat(p.sma)]));
        const average = prices.map(p => smaMap.get(p.datetime) ?? null);

        return { labels, price: priceData, average };
      })
    );
  }
}


