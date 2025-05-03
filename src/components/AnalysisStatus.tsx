import React from 'react';
import { CheckCircle, Clock, Loader } from 'lucide-react';
import { AnalysisStatus as AnalysisStatusType } from '../types';

interface AnalysisStatusProps {
  status: AnalysisStatusType;
  company: string;
  symbol: string;
  onBookmark: () => void;
}

export function AnalysisStatus({ status, company, symbol, onBookmark }: AnalysisStatusProps) {
  const getStatusIcon = (state: 'idle' | 'loading' | 'complete') => {
    switch (state) {
      case 'complete':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'loading':
        return <Loader className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const statuses = [
    { key: 'historicalPrice', label: 'Getting Historical Stock Price' },
    { key: 'financialStatement', label: 'Getting Financial Statement' },
    { key: 'recentNews', label: 'Getting Recent News' },
    { key: 'socialMedia', label: 'Getting Social Media Discussion' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Analyzing: {company} ({symbol})
        </h2>
        <button
          onClick={onBookmark}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 focus:outline-none focus:underline"
        >
          Add to Portfolio
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {statuses.map(({ key, label }) => (
          <div
            key={key}
            className="flex items-center p-4 border rounded-lg"
          >
            {getStatusIcon(status[key as keyof AnalysisStatusType])}
            <span className="ml-3 text-sm font-medium text-gray-900">{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}