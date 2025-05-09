import React, { useEffect } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Activity, BarChart2, Percent } from 'lucide-react';
import { StockDetails } from '../types';

interface StockInfoProps {
  symbol: string;
}

const dummyStockDetails: Record<string, StockDetails> = {
  AAPL: {
    ticker: 'AAPL',
    marketCap: '2.97T',
    volume: 65656288,
    avgVolume: 60393591,
    beta: 1.275,
    dividendYield: 0.52,
    peRatio: 30.97975,
    '52wHigh': 260.1,
    '52wLow': 169.21,
    priceToBook: 15.8,
    debtToEquity: '168%',
    profitMargin: '25.3%'
  },
  MSFT: {
    ticker: 'MSFT',
    marketCap: '3.12T',
    volume: 42100000,
    avgVolume: 48700000,
    beta: 1.12,
    dividendYield: 0.78,
    peRatio: 32.4,
    '52wHigh': 420.82,
    '52wLow': 275.37,
    priceToBook: 12.4,
    debtToEquity: '42%',
    profitMargin: '35.2%'
  }
};

export function StockInfo({ symbol }: StockInfoProps) {

    const [info, setInfo] = React.useState({});


  //const stockDetails = dummyStockDetails[symbol] || dummyStockDetails.AAPL;

   React.useEffect(()=>{
      (async()=>{
        if(!symbol){
            return
        }
        console.log({symbol:symbol})
          const stockInfoResponse = await fetch(`http://127.0.0.1:5002/market-overview?ticker=${symbol}`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization':`Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
              }
            });
            const stockInfocontent = await stockInfoResponse.json();
            console.log(stockInfocontent)
      
            const finalStockInfocontent = {
                ticker: stockInfocontent.ticker,
                marketCap: stockInfocontent.marketCap,
                volume: stockInfocontent.volume,
                avgVolume: stockInfocontent.avgVolume,
                beta: stockInfocontent.beta,
                dividendYield: stockInfocontent.dividendYield,
                peRatio: stockInfocontent.peRatio,
                wHigh: stockInfocontent["52wHigh"],
                wLow: stockInfocontent["52wLow"],
              }
      
            console.log(finalStockInfocontent)
      
            setInfo(finalStockInfocontent)
  
      })()
    },[symbol])

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold mb-6">{`Stock Details of ${info.ticker}`}</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-700">Market Cap</span>
            </div>
            <span className="text-sm font-semibold">{info.marketCap}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-purple-500" />
              <span className="text-sm font-medium text-gray-700">Volume</span>
            </div>
            <span className="text-sm font-semibold">
              {info.volume}
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <span className="text-sm font-medium text-gray-700">52W High</span>
            </div>
            <span className="text-sm font-semibold">${info.wHigh}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <TrendingDown className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-gray-700">52W Low</span>
            </div>
            <span className="text-sm font-semibold">${info.wLow}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <BarChart2 className="h-5 w-5 text-indigo-500" />
              <span className="text-sm font-medium text-gray-700">P/E Ratio</span>
            </div>
            <span className="text-sm font-semibold">{info.peRatio?.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Percent className="h-5 w-5 text-yellow-500" />
              <span className="text-sm font-medium text-gray-700">Dividend Yield</span>
            </div>
            <span className="text-sm font-semibold">{info.dividendYield}%</span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-orange-500" />
              <span className="text-sm font-medium text-gray-700">Beta</span>
            </div>
            <span className="text-sm font-semibold">{info.beta}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Activity className="h-5 w-5 text-cyan-500" />
              <span className="text-sm font-medium text-gray-700">Avg Volume</span>
            </div>
            <span className="text-sm font-semibold">
              {info.avgVolume}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}