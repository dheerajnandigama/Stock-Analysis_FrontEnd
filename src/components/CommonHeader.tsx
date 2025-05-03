import React from 'react';
import { LogOut } from 'lucide-react';

interface CommonHeaderProps {
  onSignOut: () => void;
}

export function CommonHeader({ onSignOut }: CommonHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1">
          {/* Left side content if needed */}
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3">
            <img
              src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
              alt="Dheeraj Nandigama"
              className="h-8 w-8 rounded-full object-cover border-2 border-blue-100"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-900">Dheeraj Nandigama</span>
              <span className="text-xs text-gray-500">Senior Analyst</span>
            </div>
          </div>
          <button
            onClick={onSignOut}
            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
            title="Sign Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}