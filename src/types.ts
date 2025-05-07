import { DivideIcon as LucideIcon } from 'lucide-react';

export interface Company {
  symbol: string;
  name: string;
}


export interface AnalysisStatus {
  historicalPrice: 'idle' | 'loading' | 'complete';
  financialStatement: 'idle' | 'loading' | 'complete';
  recentNews: 'idle' | 'loading' | 'complete';
  socialMedia: 'idle' | 'loading' | 'complete';
}

export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  sentiment: number;
  recommendation: 'Buy' | 'Sell' | 'Hold';
  pros: string[];
  cons: string[];
  prediction: number;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
  data?: {
    sentiment?: number;
    recommendation?: 'Buy' | 'Sell' | 'Hold';
    pros?: string[];
    cons?: string[];
    prediction?: number;
  };
}

export interface StockDetails {
  ticker: string;
  marketCap: string;
  volume: number;
  avgVolume: number;
  beta: number;
  dividendYield: number;
  peRatio: number;
  '52wHigh': number;
  '52wLow': number;
  priceToBook?: number;
  debtToEquity?: string;
  profitMargin?: string;
}

export interface ActiveUserStock {
  company_id: number;
  company_name: string;
  ticker_symbol: string;
  current_holding_qty: number;
  current_price: number;
  amount_invested: number;
  profit_or_loss_amount: number;
  profit_or_loss_percent: number;
  status: 'Profit' | 'Loss';
}

export interface PortfolioItem extends StockData {
  addedAt: Date;
  initialPrice: number;
  quantity: number;
  totalInvestment: number;
  currentValue: number;
  profitLoss: number;
  profitLossPercentage: number;
}

export interface PortfolioItem extends StockData {
  addedAt: Date;
  initialPrice: number;
}