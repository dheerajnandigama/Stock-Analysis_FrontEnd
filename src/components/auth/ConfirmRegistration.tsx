import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BarChart2, CheckCircle } from 'lucide-react';
import api from '../../utils/api'; // Import the `api` utility

interface ConfirmRegistrationProps {
  onConfirm: () => void;
}

export function ConfirmRegistration({ onConfirm }: ConfirmRegistrationProps) {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem('pendingConfirmation');
  if (!username) {
    navigate('/register', { replace: true }); // Redirect to register if no username is found
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Use the `api` utility instead of `axios`
      const response = await api.post('/api/users/confirm', {
        username,
        confirmation_code: confirmationCode
      });

      if (response.data.status === 'success') {
        localStorage.removeItem('pendingConfirmation');
        onConfirm(); // Update authentication state
        navigate('/'); // Redirect to the dashboard
      } else {
        setError(response.data.message || 'Confirmation failed');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Confirmation failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <BarChart2 className="h-12 w-12 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">StockAnalysis</h1>
          </div>
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">Confirm your email</h2>
          <p className="mt-2 text-gray-600">Please enter the confirmation code sent to your email</p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="confirmation-code" className="block text-sm font-medium text-gray-700">
                  Confirmation Code
                </label>
                <input
                  type="text"
                  id="confirmation-code"
                  value={confirmationCode}
                  onChange={(e) => setConfirmationCode(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter code"
                  required
                />
              </div>

              {error && (
                <div className="text-red-500 text-sm text-center">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                {isLoading ? 'Confirming...' : 'Confirm Email'}
                <CheckCircle className="ml-2 h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}