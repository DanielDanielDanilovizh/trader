export interface Strategy {
  symbol: string;
  consecutiveDays: number;
  action: 'קנייה' | 'מכירה';
  condition: string;
}
