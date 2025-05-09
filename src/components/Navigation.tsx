import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, Briefcase, UserCircle } from 'lucide-react';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  return (
    <Link
      to={to}
      className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
        isActive
          ? 'bg-blue-50 text-blue-600'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </Link>
  );
};

export function Navigation() {
  return (
    <nav className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <BarChart2 className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-semibold text-gray-900">StockAnalysis</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 space-y-2">
        <NavItem
          to="/analysis"
          icon={<BarChart2 className="h-5 w-5" />}
          label="Analysis"
        />
        <NavItem
          to="/portfolio"
          icon={<Briefcase className="h-5 w-5" />}
          label="Portfolio"
        />
        <NavItem
          to="/profile"
          icon={<UserCircle className="h-5 w-5" />}
          label="Profile"
        />
      </div>
    </nav>
  );
}
