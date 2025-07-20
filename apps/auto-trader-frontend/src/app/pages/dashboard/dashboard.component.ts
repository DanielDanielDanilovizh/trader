import { Strategy } from '@auto-trader/types';
import { Component, inject, OnInit } from '@angular/core';
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Legend,
} from 'chart.js';
import { StockService } from '../../services/stock.service';
import { CommonModule } from '@angular/common';
import { StockSelectorComponent } from '../../components/stock_selector/stock-selector.component';
import { AddStrategyComponent } from '../../components/add_strategy/add-strategy.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, StockSelectorComponent, AddStrategyComponent],
  templateUrl: './dashboard.component.html',
})

export class DashboardComponent implements OnInit {
  onStrategyAdded(strategy: Strategy) {
    this.strategies.push(strategy);
  }
  strategies: Strategy[] = [];

  selectedSymbol = '';

  private stockService: StockService = inject(StockService);

  loadData(symbol: string) {
    this.selectedSymbol = symbol;
    this.renderChart(symbol);
  }

  ngOnInit(): void {
    this.renderChart();
  }

  renderChart(symbol?: string) {
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, CategoryScale, Legend);

    const chartSymbol = symbol || this.selectedSymbol || 'AAPL';
    this.stockService.getPriceAndAverage(chartSymbol, 20).subscribe((data) => {
      console.log('Chart data:', data);
      const ctx = document.getElementById('stockChart') as HTMLCanvasElement;
      if (!ctx) return;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: 'מחיר מניה',
              data: data.price,
              borderColor: 'blue',
              borderWidth: 2,
              fill: false,
            },
            {
              label: 'ממוצע נע',
              data: data.average,
              borderColor: 'gray',
              borderDash: [5, 5],
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        },
      });
    });
  }
}
