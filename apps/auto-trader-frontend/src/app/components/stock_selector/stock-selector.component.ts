import { Component, Output, EventEmitter, inject } from '@angular/core';
import { StockService } from '../../services/stock.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-stock-selector',
  templateUrl: './stock-selector.component.html',
  imports: [CommonModule, FormsModule],
})
export class StockSelectorComponent {
  searchTerm = '';
  results: Array<{ symbol: string; name: string; currency: string; country: string }> = [];
  selectedSymbol = '';

  @Output() symbolSelected = new EventEmitter<string>();

  private stockService:StockService = inject(StockService);

  onSearchChange() {
    if (this.searchTerm.length < 2) {
      this.results = [];
      return;
    }
    this.stockService.searchStocks(this.searchTerm).subscribe((data) => {
      this.results = data;
    });
  }

  selectSymbol(symbol: string) {
    this.selectedSymbol = symbol;
    this.results = [];
    this.symbolSelected.emit(symbol);
  }
}
