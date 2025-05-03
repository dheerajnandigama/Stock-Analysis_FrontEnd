import React from 'react';
import { ArrowUpRight, ArrowDownRight, Minus, Activity, TrendingUp, BarChart2, LineChart } from 'lucide-react';

interface IndicatorProps {
  name: string;
  value: string;
  signal: 'buy' | 'sell' | 'neutral';
  description: string;
}

const technicalData = {
  AAPL: [
    { name: 'RSI (14)', value: '65.42', signal: 'buy', description: 'Momentum is strong but not overbought' },
    { name: 'MACD', value: '1.23', signal: 'buy', description: 'Bullish crossover detected' },
    { name: 'Stochastic', value: '82.31', signal: 'sell', description: 'Approaching overbought territory' },
    { name: 'Moving Avg (20)', value: '168.45', signal: 'neutral', description: 'Price trading above MA' },
    { name: 'Bollinger Bands', value: 'Upper', signal: 'sell', description: 'Price near upper band' },
    { name: 'Volume', value: '58.2M', signal: 'buy', description: 'Above average volume' }
  ],
  MSFT: [
    { name: 'RSI (14)', value: '58.73', signal: 'neutral', description: 'Momentum is balanced' },
    { name: 'MACD', value: '2.45', signal: 'buy', description: 'Strong bullish trend' },
    { name: 'Stochastic', value: '75.64', signal: 'neutral', description: 'Trending upwards' },
    { name: 'Moving Avg (20)', value: '415.32', signal: 'buy', description: 'Strong upward trend' },
    { name: 'Bollinger Bands', value: 'Middle', signal: 'neutral', description: 'Price within bands' },
    { name: 'Volume', value: '42.1M', signal: 'neutral', description: 'Normal trading volume' }
  ],
  NVDA: [
    { name: 'RSI (14)', value: '78.92', signal: 'sell', description: 'Overbought conditions' },
    { name: 'MACD', value: '5.67', signal: 'buy', description: 'Strong momentum' },
    { name: 'Stochastic', value: '92.45', signal: 'sell', description: 'Extremely overbought' },
    { name: 'Moving Avg (20)', value: '845.67', signal: 'buy', description: 'Price well above MA' },
    { name: 'Bollinger Bands', value: 'Upper', signal: 'sell', description: 'Extended above upper band' },
    { name: 'Volume', value: '35.8M', signal: 'buy', description: 'High trading activity' }
  ],
  TSLA: [
    { name: 'RSI (14)', value: '42.31', signal: 'neutral', description: 'Neutral momentum' },
    { name: 'MACD', value: '-0.85', signal: 'sell', description: 'Bearish crossover' },
    { name: 'Stochastic', value: '35.67', signal: 'buy', description: 'Approaching oversold' },
    { name: 'Moving Avg (20)', value: '182.45', signal: 'sell', description: 'Below moving average' },
    { name: 'Bollinger Bands', value: 'Lower', signal: 'buy', description: 'Near lower band' },
    { name: 'Volume', value: '92.4M', signal: 'neutral', description: 'Average volume' }
  ]
};

const Indicator: React.FC<IndicatorProps> = ({ name, value, signal, description }) => {
  const getSignalColor = () => {
    switch (signal) {
      case 'buy':
        return 'text-green-600';
      case 'sell':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getSignalIcon = () => {
    switch (signal) {
      case 'buy':
        return <ArrowUpRight className="h-4 w-4 text-green-600" />;
      case 'sell':
        return <ArrowDownRight className="h-4 w-4 text-red-600" />;
      default:
        return <Minus className="h-4 w-4 text-gray-600" />;
    }
  };

  const getIndicatorIcon = () => {
    switch (name.split(' ')[0]) {
      case 'RSI':
        return <Activity className="h-5 w-5 text-purple-500" />;
      case 'MACD':
        return <TrendingUp className="h-5 w-5 text-blue-500" />;
      case 'Stochastic':
        return <BarChart2 className="h-5 w-5 text-indigo-500" />;
      case 'Moving':
        return <LineChart className="h-5 w-5 text-green-500" />;
      default:
        return <Activity className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="flex flex-col space-y-2 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {getIndicatorIcon()}
          <span className="text-sm font-medium text-gray-700">{name}</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className={`text-sm font-semibold ${getSignalColor()}`}>{value}</span>
          {getSignalIcon()}
        </div>
      </div>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  );
};

interface TechnicalIndicatorsProps {
  symbol: string;
}

export function TechnicalIndicators({ symbol }: TechnicalIndicatorsProps) {
  const indicators = technicalData[symbol as keyof typeof technicalData] || technicalData.AAPL;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-4">Technical Indicators</h3>
      <div className="space-y-4">
        {indicators.map((indicator, index) => (
          <Indicator key={index} {...indicator} />
        ))}
      </div>
    </div>
  );
}