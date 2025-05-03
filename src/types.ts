export interface Company {
  symbol: string;
  name: string;
}

export interface ChatHistory {
  id: string;
  timestamp: Date;
  symbol: string;
  query: string;
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

export interface PortfolioItem extends StockData {
  addedAt: Date;
  initialPrice: number;
}