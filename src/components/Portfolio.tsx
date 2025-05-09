import React from 'react';
import { Trash2, TrendingUp, TrendingDown, DollarSign, Calendar, Search } from 'lucide-react';
import { PortfolioItem, Company, StockTransaction } from '../types';
import { StockSelector } from './StockSelector';
import { StockInfo } from './StockInfo';

interface PortfolioProps {
  items: PortfolioItem[];
  onRemove: (symbol: string) => void;
}

const mockStockPrices: Record<string, number> = {
  AAPL: 198.89,
  MSFT: 420.45,
  GOOGL: 142.65,
  AMZN: 175.35
};

export function Portfolio({ items, onRemove }: PortfolioProps) {
  const [port, setPort] = React.useState([]);
  const [selectedStock, setSelectedStock] = React.useState('');
  const [transactions, setTransactions] = React.useState<StockTransaction[]>([]);
  const [portfolio, setPortfolio] = React.useState<PortfolioItem[]>(
    items.map(item => ({
      ...item,
      currentValue: item.currentValue || 0,
      totalInvestment: item.totalInvestment || 0,
      profitLoss: item.profitLoss || 0,
      profitLossPercentage: item.profitLossPercentage || 0,
      quantity: item.quantity || 0
    }))
  );

  const callPortfolio = async () =>{
    const portfolioResponse = await fetch('http://stockmarket-alb-1239048680.us-east-1.elb.amazonaws.com/portfolio', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization':`Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
      }
    });
    const portfolioContent = await portfolioResponse.json();
    console.log(portfolioContent)

    const finalportfolioContent = {
      portfolio:  portfolioContent.portfolio.map((eachData)=>{
        return {
          currentValue: eachData.amount_invested,
          // "company_id": 3,
          name: eachData.company_name,
          quantity: eachData.current_holding_qty,
          price: eachData.current_price,
          profitLoss: eachData.profit_or_loss_amount,
          profitLossPercentage: eachData.profit_or_loss_percent,
         // "status": "Loss",
          symbol: eachData.ticker_symbol
        }
      }),
      summary : portfolioContent.summary
    }
    console.log(finalportfolioContent)

    setPort(finalportfolioContent)
    
  }

   React.useEffect(()=>{
    callPortfolio()
    },[])

  const totalValue = portfolio.reduce((sum, item) => sum + (item.currentValue || 0), 0);
  const totalInvestment = portfolio.reduce((sum, item) => sum + (item.totalInvestment || 0), 0);
  const totalProfitLoss = totalValue - totalInvestment;
  const totalProfitLossPercentage = totalInvestment !== 0 
    ? ((totalValue - totalInvestment) / totalInvestment) * 100 
    : 0;

  const handleStockTransaction = (stock: Company, quantity: number, type: 'buy' | 'sell') => {
    const price = mockStockPrices[stock.symbol] || 0;
    const transaction: StockTransaction = {
      type,
      quantity,
      price,
      timestamp: new Date()
    };

    setTransactions(prev => [...prev, transaction]);

    const existingStock = portfolio.find(item => item.symbol === stock.symbol);
    if (existingStock) {
      if (type === 'buy') {
        const newQuantity = (existingStock.quantity || 0) + quantity;
        const newTotalInvestment = (existingStock.totalInvestment || 0) + (quantity * price);
        const newCurrentValue = newQuantity * price;
        
        setPortfolio(prev => prev.map(item => 
          item.symbol === stock.symbol
            ? {
                ...item,
                quantity: newQuantity,
                totalInvestment: newTotalInvestment,
                currentValue: newCurrentValue,
                profitLoss: newCurrentValue - newTotalInvestment,
                profitLossPercentage: newTotalInvestment !== 0 
                  ? ((newCurrentValue - newTotalInvestment) / newTotalInvestment) * 100 
                  : 0
              }
            : item
        ));
      } else {
        if ((existingStock.quantity || 0) >= quantity) {
          const newQuantity = (existingStock.quantity || 0) - quantity;
          const soldAmount = quantity * price;
          const newTotalInvestment = existingStock.totalInvestment 
            ? existingStock.totalInvestment * (newQuantity / existingStock.quantity) 
            : 0;
          const newCurrentValue = newQuantity * price;

          if (newQuantity === 0) {
            setPortfolio(prev => prev.filter(item => item.symbol !== stock.symbol));
          } else {
            setPortfolio(prev => prev.map(item =>
              item.symbol === stock.symbol
                ? {
                    ...item,
                    quantity: newQuantity,
                    totalInvestment: newTotalInvestment,
                    currentValue: newCurrentValue,
                    profitLoss: newCurrentValue - newTotalInvestment,
                    profitLossPercentage: newTotalInvestment !== 0 
                      ? ((newCurrentValue - newTotalInvestment) / newTotalInvestment) * 100 
                      : 0
                  }
                : item
            ));
          }
        }
      }
    } else if (type === 'buy') {
      const newStock: PortfolioItem = {
        symbol: stock.symbol,
        name: stock.name,
        price,
        change: 0,
        sentiment: 75,
        recommendation: 'Buy',
        pros: ['New position'],
        cons: ['Market volatility'],
        prediction: price * 1.1,
        messages: [],
        addedAt: new Date(),
        initialPrice: price,
        quantity,
        totalInvestment: quantity * price,
        currentValue: quantity * price,
        profitLoss: 0,
        profitLossPercentage: 0
      };
      
      setPortfolio(prev => [...prev, newStock]);
    }
  };

  return (
    <div className="space-y-6">
      <StockSelector onSelect={handleStockTransaction} callPortfolio={callPortfolio} />

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Portfolio Overview</h2>
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Value</p>
              <p className="text-xl font-semibold">${port?.summary?.["total_amount_invested"]}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Total P/L</p>
              <p className={`text-lg font-semibold ${port?.summary?.["status"] === "Profit" ? 'text-green-500' : 'text-red-500'}`}>
                ${port?.summary?.["total_profit_or_loss_amount"].toFixed(2)} ({port?.summary?.["total_profit_or_loss_percent"].toFixed(2)}%)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {port?.portfolio?.map((item) => {
            const isPositive = (item.profitLoss || 0) >= 0;

            return (
              <div 
                key={item.symbol} 
                className={`bg-gray-50 rounded-lg p-6 relative group cursor-pointer ${
                  selectedStock === item.symbol ? 'ring-2 ring-blue-500' : ''
                }`}
                onClick={() => setSelectedStock(item.symbol)}
              >

                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                      <span className="text-sm text-gray-500">{item.symbol}</span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">Current Price</p>
                        <div className="flex items-baseline space-x-2 mt-1">
                          <span className="text-xl font-semibold">${(item.price || 0).toFixed(2)}</span>
                          {isPositive ? (
                            <TrendingUp className="h-4 w-4 text-green-500" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="text-xl font-semibold mt-1">{item.quantity || 0}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Total Value</p>
                        <p className="text-lg font-semibold">${(item.currentValue || 0).toFixed(2)}</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-500">Profit/Loss</p>
                        <p className={`text-lg font-semibold ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
                          {isPositive ? '+' : ''}{(item.profitLoss || 0).toFixed(2)} ({(item.profitLossPercentage || 0).toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {portfolio.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Your portfolio is empty. Start by adding stocks using the selector above.</p>
          </div>
        )}
      </div>

      {selectedStock && (
        <StockInfo symbol={selectedStock} />
      )}
    </div>
  );
}