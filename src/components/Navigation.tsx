import React from 'react';
import { BarChart2, Briefcase, MessageSquare, UserCircle } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItem> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-200 ${
      isActive
        ? 'bg-blue-50 text-blue-600'
        : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {icon}
    <span className="font-medium">{label}</span>
  </button>
);

interface NavigationProps {
  activeView: string;
  onViewChange: (view: 'analysis' | 'portfolio' | 'chat' | 'profile') => void;
}

export function Navigation({ activeView, onViewChange }: NavigationProps) {
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
          icon={<BarChart2 className="h-5 w-5" />}
          label="Analysis"
          isActive={activeView === 'analysis'}
          onClick={() => onViewChange('analysis')}
        />
        <NavItem
          icon={<Briefcase className="h-5 w-5" />}
          label="Portfolio"
          isActive={activeView === 'portfolio'}
          onClick={() => onViewChange('portfolio')}
        />
        <NavItem
          icon={<MessageSquare className="h-5 w-5" />}
          label="Chat History"
          isActive={activeView === 'chat'}
          onClick={() => onViewChange('chat')}
        />
        <NavItem
          icon={<UserCircle className="h-5 w-5" />}
          label="Profile"
          isActive={activeView === 'profile'}
          onClick={() => onViewChange('profile')}
        />
      </div>
    </nav>
  );
}