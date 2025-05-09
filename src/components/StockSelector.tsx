import React from 'react';
import { ChevronDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Company } from '../types';
import toast, { Toaster } from 'react-hot-toast';


interface StockSelectorProps {
  onSelect: (stock: Company, quantity: number, type: 'buy' | 'sell') => void;
  callPortfolio: () => void;

}

export function StockSelector({ onSelect,callPortfolio  }: StockSelectorProps) {
  const [allStocks, setAllStocks] = React.useState([]);
  const [currPrice, setCurrPrice] = React.useState({});
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [selectedStock, setSelectedStock] = React.useState<Company | null>(null);
  const [quantity, setQuantity] = React.useState(1);
  const [transactionType, setTransactionType] = React.useState<'buy' | 'sell'>('buy');
  const dropdownRef = React.useRef<HTMLDivElement>(null);



  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  React.useEffect(()=>{
    (async()=>{
        const allStockResponse = await fetch('http://localhost:5002/companies', {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
            }
          });
          const allStockcontent = await allStockResponse.json();
          console.log(allStockcontent)
    
          const finalStockContent = allStockcontent.map((eachData)=>{
            return {
              symbol: eachData.ticker_symbol,
              name: eachData.company_name,
              description: eachData.company_description
            }
          })
    
          console.log(finalStockContent)
    
          setAllStocks(finalStockContent)

    })()
  },[])

  React.useEffect(()=>{
    (async()=>{
        const currPriceResponse = await fetch(`http://localhost:5002/current-price?ticker=${selectedStock.symbol}`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
            }
          });
          const currPriceContent = await currPriceResponse.json();
    
    
    
          setCurrPrice(currPriceContent)

    })()
  },[selectedStock])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedStock) {
      onSelect(selectedStock, quantity, transactionType);
      setSelectedStock(null);
      setQuantity(1);
      setIsDropdownOpen(false);
    }
  };

  const executeTransaction = async () => {
    try {
      const rawResponse = await fetch('http://localhost:5002/transaction', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
        },
        body: JSON.stringify({
          "ticker": selectedStock?.symbol,
          "trade_qty": quantity,
          "action": transactionType.toLocaleUpperCase(),
          "action_price": currPrice?.currentPrice,
          "timestamp": new Date().toISOString().split('.')[0]
        })
      });
      
      const content = await rawResponse.json();
      
      if (content.message === "Transaction recorded successfully") {
        toast.success('Transaction completed successfully!', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#10B981',
            color: '#fff',
          },
        });
        
        // Reset form
        setSelectedStock(null);
        setQuantity(1);
        setIsDropdownOpen(false);
        
        // Refresh portfolio
        await callPortfolio();
      } else if (content.error === "Not enough shares to sell") {
        toast.error('Insufficient shares to sell. Please check your portfolio holdings.', {
          duration: 5000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        });
      } else {
        toast.error('Transaction failed. Please try again.', {
          duration: 4000,
          position: 'top-right',
          style: {
            background: '#EF4444',
            color: '#fff',
          },
        });
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.', {
        duration: 4000,
        position: 'top-right',
        style: {
          background: '#EF4444',
          color: '#fff',
        },
      });
      console.error('Transaction error:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster
        position="top-right"
        toastOptions={{
          className: '',
          style: {
            marginTop: '80px',
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold mb-4">Add Stock to Portfolio</h3>
        
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-left flex items-center justify-between hover:border-gray-300 transition-colors"
          >
            {selectedStock ? (
              <div>
                <span className="font-medium text-gray-900">{selectedStock.symbol}</span>
                <span className="ml-2 text-gray-500">{selectedStock.name}</span>
              </div>
            ) : (
              <span className="text-gray-500">Select a stock</span>
            )}
            <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
          </button>

          {isDropdownOpen && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto">
              {allStocks.map((stock) => (
                <button
                  key={stock.symbol}
                  onClick={() => {
                    setSelectedStock(stock);
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-medium text-gray-900">{stock.symbol}</span>
                      <span className="ml-2 text-sm text-gray-500">{stock.name}</span>
                    </div>
                    {selectedStock?.symbol === stock.symbol && (
                      <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    )}
                  </div>
                  {stock.description && (
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{stock.description}</p>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedStock && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex-1">
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  {`Current Price (${currPrice?.ticker})`}
                </label>
                <input
                  type="number"
                  disabled
                  id="quantity"
                  min="1"
                  value={currPrice?.currentPrice}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Transaction Type
                </label>
                <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setTransactionType('buy')}
                    className={`flex-1 px-4 py-2 flex items-center justify-center space-x-2 ${
                      transactionType === 'buy'
                        ? 'bg-green-50 text-green-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <TrendingUp className="h-4 w-4" />
                    <span>Buy</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTransactionType('sell')}
                    className={`flex-1 px-4 py-2 flex items-center justify-center space-x-2 ${
                      transactionType === 'sell'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <TrendingDown className="h-4 w-4" />
                    <span>Sell</span>
                  </button>
                </div>
              </div>
            </div>

            <button
                onClick={executeTransaction}
              type="submit"
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {transactionType === 'buy' ? 'Buy Stock' : 'Sell Stock'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}