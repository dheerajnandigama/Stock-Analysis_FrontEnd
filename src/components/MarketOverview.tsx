import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, Activity, Globe, Clock, BarChart2, Percent } from 'lucide-react';

interface MarketOverviewProps {
  symbol: string;
}

const marketData = {
  AAPL: {
    marketCap: '2.94T',
    volume: '58.2M',
    high52w: '198.23',
    low52w: '124.17',
    peRatio: '28.5',
    dividend: '0.92%',
    avgVolume: '65.3M',
    beta: '1.23'
  },
  MSFT: {
    marketCap: '3.12T',
    volume: '42.1M',
    high52w: '420.82',
    low52w: '275.37',
    peRatio: '32.4',
    dividend: '0.78%',
    avgVolume: '48.7M',
    beta: '1.12'
  },
  NVDA: {
    marketCap: '2.15T',
    volume: '35.8M',
    high52w: '974.00',
    low52w: '222.97',
    peRatio: '95.2',
    dividend: '0.05%',
    avgVolume: '42.5M',
    beta: '1.87'
  },
  TSLA: {
    marketCap: '685.2B',
    volume: '92.4M',
    high52w: '299.29',
    low52w: '152.37',
    peRatio: '48.7',
    dividend: '0%',
    avgVolume: '108.2M',
    beta: '2.42'
  }
};

export function MarketOverview({ symbol }: MarketOverviewProps) {
  const data = marketData[symbol as keyof typeof marketData] || marketData.AAPL;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Market Overview</h3>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <DollarSign className="h-5 w-5 text-blue-500" />
            <span className="text-sm font-medium">Market Cap</span>
          </div>
          <span className="text-sm font-semibold">${data.marketCap}</span>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Activity className="h-5 w-5 text-purple-500" />
            <span className="text-sm font-medium">Volume</span>
          </div>
          <span className="text-sm font-semibold">{data.volume}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="text-sm font-medium">52W High</span>
          </div>
          <span className="text-sm font-semibold">${data.high52w}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <TrendingDown className="h-5 w-5 text-red-500" />
            <span className="text-sm font-medium">52W Low</span>
          </div>
          <span className="text-sm font-semibold">${data.low52w}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <BarChart2 className="h-5 w-5 text-indigo-500" />
            <span className="text-sm font-medium">P/E Ratio</span>
          </div>
          <span className="text-sm font-semibold">{data.peRatio}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Percent className="h-5 w-5 text-yellow-500" />
            <span className="text-sm font-medium">Dividend Yield</span>
          </div>
          <span className="text-sm font-semibold">{data.dividend}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-orange-500" />
            <span className="text-sm font-medium">Avg Volume</span>
          </div>
          <span className="text-sm font-semibold">{data.avgVolume}</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-teal-500" />
            <span className="text-sm font-medium">Beta</span>
          </div>
          <span className="text-sm font-semibold">{data.beta}</span>
        </div>
      </div>
    </div>
  );
}