import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StockSelectorComponent } from '../stock_selector/stock-selector.component';
import { Strategy } from '@auto-trader/types';

@Component({
  selector: 'app-add-strategy',
  templateUrl: './add-strategy.component.html',
  imports: [CommonModule, FormsModule, StockSelectorComponent],
})
export class AddStrategyComponent {
  selectedSymbol = '';
  isBuy = true;
  consecutiveDays = 1;
  condition = 'higher';

  @Output() strategyAdded = new EventEmitter<Strategy>();

  onSymbolSelected(symbol: string) {
    this.selectedSymbol = symbol;
  }

  addStrategy() {
    this.strategyAdded.emit({
      symbol: this.selectedSymbol,
      action: this.isBuy ? 'קנייה' : 'מכירה',
      consecutiveDays: this.consecutiveDays,
      condition: this.condition,
    });
    // Optionally reset form fields here
  }
}
