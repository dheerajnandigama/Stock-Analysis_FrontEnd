import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Analysis } from './components/Analysis';
import { Portfolio } from './components/Portfolio';
import { Profile } from './components/Profile';
import { Login } from './components/auth/Login';
import { Register } from './components/auth/Register';
import { CommonHeader } from './components/CommonHeader';
import { ConfirmRegistration } from './components/auth/ConfirmRegistration';
import { AnalysisStatus as AnalysisStatusType, PortfolioItem, StockData } from './types';
import api from './utils/api';


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
  messages: [],
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

  const handleSearch = (symbol: string, query: string) => {
    setSelectedCompany({ symbol, name: mockStockData.name });
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Navigation />
      <div className="flex-1 overflow-auto">
        <CommonHeader onSignOut={onLogout} />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Navigate to="/analysis" replace />} />
            <Route path="/analysis" element={<Analysis data={mockStockData} />} />
            <Route path="/portfolio" element={<Portfolio items={portfolio} onRemove={handleRemoveFromPortfolio} />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
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
      username: userData.username,
      accessToken: userData.tokens.access_token
    }));
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    try {
      // Use the `api` utility for the logout reques
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
