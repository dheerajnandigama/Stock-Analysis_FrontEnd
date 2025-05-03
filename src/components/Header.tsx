import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { Company } from '../types';

const companies: Company[] = [
  { symbol: 'AAPL', name: 'Apple Inc.' },
  { symbol: 'MSFT', name: 'Microsoft Corporation' },
  { symbol: 'ASYS', name: 'Amtech Systems, Inc.' },
  { symbol: 'ABBV', name: 'AbbVie Inc.' },
];

interface HeaderProps {
  onSearch: (symbol: string, query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(null);
  const [query, setQuery] = React.useState('');
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCompany) {
      onSearch(selectedCompany.symbol, query);
    }
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Stock Market Analysis Tool</h1>
        
        <form onSubmit={handleSubmit} className="flex gap-4">
          <div className="relative flex-1">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {selectedCompany ? `${selectedCompany.name} (${selectedCompany.symbol})` : 'Select a company'}
              <ChevronDown className="ml-2 h-4 w-4 text-gray-400" />
            </button>
            
            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                {companies.map((company) => (
                  <button
                    key={company.symbol}
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    onClick={() => {
                      setSelectedCompany(company);
                      setIsDropdownOpen(false);
                    }}
                  >
                    {company.name} ({company.symbol})
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Enter your analysis query..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={!selectedCompany}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Analyze
          </button>
        </form>
      </div>
    </header>
  );
}