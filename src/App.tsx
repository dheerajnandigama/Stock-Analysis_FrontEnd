import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { AnalysisStatus } from './components/AnalysisStatus';
import { StockChart } from './components/StockChart';
import { Analysis } from './components/Analysis';
import { Portfolio } from './components/Portfolio';
import { ChatHistory } from './components/ChatHistory';
import { Profile } from './components/Profile';
import { MarketOverview } from './components/MarketOverview';
import { TechnicalIndicators } from './components/TechnicalIndicators';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { ConfirmRegistration } from './components/auth/ConfirmRegistration';
import { CommonHeader } from './components/CommonHeader';
import { AnalysisStatus as AnalysisStatusType, ChatHistory as ChatHistoryType, PortfolioItem, StockData } from './types';
import api from './utils/api';
// Mock data for demonstration
const mockHistoricalData = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(2024, 0, i + 1).toLocaleDateString(),
  price: 150 + Math.random() * 20,
}));

const mockStockData: StockData = {
  symbol: 'AAPL',
  name: 'Apple Inc.',
  price: 170.25,
  change: 2.5,
  sentiment: 75,
  recommendation: 'Buy',
  pros: [
    'Strong market position',
    'Consistent revenue growth',
    'High customer loyalty',
  ],
  cons: [
    'Supply chain challenges',
    'Market saturation in key segments',
    'Regulatory pressures',
  ],
  prediction: 185.50,
  messages: [
    {
      id: '1',
      type: 'user',
      content: 'Can you analyze Apple stock and provide investment recommendations?',
      timestamp: new Date(),
    },
    {
      id: '2',
      type: 'ai',
      content: "Based on my analysis of Apple Inc. (AAPL), here's what I've found:",
      timestamp: new Date(),
      data: {
        sentiment: 75,
        recommendation: 'Buy',
        pros: [
          'Strong market position',
          'Consistent revenue growth',
          'High customer loyalty',
        ],
        cons: [
          'Supply chain challenges',
          'Market saturation in key segments',
          'Regulatory pressures',
        ],
        prediction: 185.50,
      },
    },
  ],
};

const mockPortfolioData: PortfolioItem[] = [
  {
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: 170.25,
    change: 2.5,
    sentiment: 75,
    recommendation: 'Buy',
    pros: ['Strong market position', 'Consistent revenue growth'],
    cons: ['Supply chain challenges'],
    prediction: 185.50,
    messages: [],
    addedAt: new Date('2024-01-15'),
    initialPrice: 150.75
  },
  {
    symbol: 'MSFT',
    name: 'Microsoft Corporation',
    price: 420.45,
    change: 5.2,
    sentiment: 82,
    recommendation: 'Buy',
    pros: ['Cloud leadership', 'AI integration'],
    cons: ['Regulatory concerns'],
    prediction: 450.00,
    messages: [],
    addedAt: new Date('2024-02-01'),
    initialPrice: 390.20
  },
  {
    symbol: 'NVDA',
    name: 'NVIDIA Corporation',
    price: 880.30,
    change: 15.4,
    sentiment: 90,
    recommendation: 'Buy',
    pros: ['AI dominance', 'Strong growth'],
    cons: ['High valuation'],
    prediction: 920.00,
    messages: [],
    addedAt: new Date('2024-02-15'),
    initialPrice: 700.50
  },
  {
    symbol: 'TSLA',
    name: 'Tesla, Inc.',
    price: 175.45,
    change: -3.2,
    sentiment: 65,
    recommendation: 'Hold',
    pros: ['EV market leader', 'Innovation'],
    cons: ['Increasing competition'],
    prediction: 190.00,
    messages: [],
    addedAt: new Date('2024-03-01'),
    initialPrice: 185.30
  }
];

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [selectedCompany, setSelectedCompany] = React.useState<{ symbol: string; name: string } | null>(null);
  const [analysisStatus, setAnalysisStatus] = React.useState<AnalysisStatusType>({
    historicalPrice: 'idle',
    financialStatement: 'idle',
    recentNews: 'idle',
    socialMedia: 'idle',
  });
  const [portfolio, setPortfolio] = React.useState<PortfolioItem[]>(mockPortfolioData);
  const [chatHistory, setChatHistory] = React.useState<ChatHistoryType[]>([]);
  const [activeView, setActiveView] = React.useState<'analysis' | 'portfolio' | 'chat' | 'profile'>('analysis');

  const handleSearch = (symbol: string, query: string) => {
    setSelectedCompany({ symbol, name: mockStockData.name });
    setActiveView('analysis');
    
    setAnalysisStatus({
      historicalPrice: 'loading',
      financialStatement: 'idle',
      recentNews: 'idle',
      socialMedia: 'idle',
    });

    const stages = ['historicalPrice', 'financialStatement', 'recentNews', 'socialMedia'];
    stages.forEach((stage, index) => {
      setTimeout(() => {
        setAnalysisStatus((prev) => ({
          ...prev,
          [stage]: 'loading',
        }));

        setTimeout(() => {
          setAnalysisStatus((prev) => ({
            ...prev,
            [stage]: 'complete',
          }));
        }, 1000);
      }, index * 2000);
    });

    setChatHistory((prev) => [
      {
        id: Date.now().toString(),
        timestamp: new Date(),
        symbol,
        query,
      },
      ...prev,
    ]);
  };

  const handleBookmark = () => {
    if (selectedCompany) {
      setPortfolio((prev) => [
        ...prev,
        {
          ...mockStockData,
          addedAt: new Date(),
          initialPrice: mockStockData.price,
        },
      ]);
    }
  };

  const handleRemoveFromPortfolio = (symbol: string) => {
    setPortfolio((prev) => prev.filter((item) => item.symbol !== symbol));
  };

  const handleSelectChat = (chat: ChatHistoryType) => {
    handleSearch(chat.symbol, chat.query);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'portfolio':
        return <Portfolio items={portfolio} onRemove={handleRemoveFromPortfolio} />;
      case 'chat':
        return <ChatHistory history={chatHistory} onSelect={handleSelectChat} />;
      case 'profile':
        return <Profile />;
      default:
        return (
          <>
            {selectedCompany ? (
              <>
                <AnalysisStatus
                  status={analysisStatus}
                  company={selectedCompany.name}
                  symbol={selectedCompany.symbol}
                  onBookmark={handleBookmark}
                />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <StockChart data={mockHistoricalData} />
                  </div>
                  <div>
                    <MarketOverview symbol={selectedCompany.symbol} />
                  </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                  <div className="lg:col-span-2">
                    <Analysis data={mockStockData} />
                  </div>
                  <div>
                    <TechnicalIndicators symbol={selectedCompany.symbol} />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-gray-900">Welcome to Stock Analysis</h2>
                <p className="mt-2 text-gray-600">Select a company to begin analysis</p>
              </div>
            )}
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation activeView={activeView} onViewChange={setActiveView} />
      <div className="flex-1 overflow-auto">
        <CommonHeader onSignOut={onLogout} />
        <Header onSearch={handleSearch} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    // Check if user data exists in localStorage
    const isAuth = !!localStorage.getItem('user');
    console.log('Authentication State:', isAuth);
    return isAuth;
  });

  const handleLogin = (userData: any) => {
    // Store minimal user data
    localStorage.setItem('user', JSON.stringify({
      user_id: userData.user_id,
      username: userData.username
    }));
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      // Use the `api` utility for the logout request
      await api.post('/api/users/logout', {}, {
        withCredentials: true // Ensure cookies are sent
      });
      localStorage.removeItem('user');
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Register />
            )
          }
        />
        <Route
          path="/confirm"
          element={<ConfirmRegistration onConfirm={() => {}}/>}
        />
        <Route
          path="/*"
          element={
            isAuthenticated ? (
              <Dashboard onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;