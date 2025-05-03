import React from 'react';
import { Trash2, TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';
import { PortfolioItem } from '../types';

interface PortfolioProps {
  items: PortfolioItem[];
  onRemove: (symbol: string) => void;
}

export function Portfolio({ items, onRemove }: PortfolioProps) {
  const totalValue = items.reduce((sum, item) => sum + item.price, 0);
  const totalGain = items.reduce((sum, item) => sum + (item.price - item.initialPrice), 0);
  const totalGainPercentage = (totalGain / (totalValue - totalGain)) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Portfolio Overview</h2>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-5 w-5 text-gray-500" />
            <span className="text-lg font-semibold">${totalValue.toFixed(2)}</span>
            <span className={`text-sm font-medium ${totalGainPercentage >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalGainPercentage >= 0 ? '+' : ''}{totalGainPercentage.toFixed(2)}%
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map((item) => {
            const percentageChange = ((item.price - item.initialPrice) / item.initialPrice) * 100;
            const isPositive = percentageChange >= 0;
            const gainLoss = item.price - item.initialPrice;

            return (
              <div key={item.symbol} className="bg-gray-50 rounded-lg p-6 relative group">
                <button
                  onClick={() => onRemove(item.symbol)}
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500" />
                </button>

                <div className="flex items-start space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <span className="text-sm text-gray-500">{item.symbol}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Current Price</p>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="text-xl font-semibold">${item.price.toFixed(2)}</span>
                          {isPositive ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Initial Price</p>
                        <p className="text-xl font-semibold mt-1">${item.initialPrice.toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Gain/Loss</p>
                        <p className={`text-lg font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {isPositive ? '+' : ''}{gainLoss.toFixed(2)} ({percentageChange.toFixed(2)}%)
                        </p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Added Date</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {new Date(item.addedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Your portfolio is empty. Start by analyzing stocks and adding them to your portfolio.</p>
          </div>
        )}
      </div>
    </div>
  );
}