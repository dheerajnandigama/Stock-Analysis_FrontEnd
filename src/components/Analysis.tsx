import React from 'react';
import { TrendingUp, TrendingDown, User, Bot, Send } from 'lucide-react';
import { StockData, ChatMessage } from '../types';

interface AnalysisProps {
  data: StockData;
}

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isAI = message.type === 'ai';
  
  return (
    <div className={`flex items-start space-x-3 ${isAI ? 'justify-start' : 'justify-end'}`}>
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
          isAI ? 'bg-purple-100' : 'bg-blue-100'
        }`}>
          {isAI ? (
            <Bot className="h-5 w-5 text-purple-600" />
          ) : (
            <User className="h-5 w-5 text-blue-600" />
          )}
        </div>
      </div>
      <div className={`flex-1 ${isAI ? 'mr-12' : 'ml-12'}`}>
        <div className={`rounded-lg p-4 ${
          isAI ? 'bg-white border border-gray-200' : 'bg-blue-50'
        }`}>
          <p className="text-gray-800 mb-2">{message.content}</p>
          
          {message.data && (
            <div className="mt-4 space-y-4">
              {message.data.sentiment && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Market Sentiment</h4>
                  <div className="flex items-center space-x-3">
                    <span className={`text-2xl font-bold ${
                      message.data.sentiment >= 70 ? 'text-green-500' : 
                      message.data.sentiment >= 30 ? 'text-yellow-500' : 
                      'text-red-500'
                    }`}>
                      {message.data.sentiment}%
                    </span>
                    {message.data.sentiment >= 50 ? (
                      <TrendingUp className="h-5 w-5 text-green-500" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                </div>
              )}
              
              {message.data.recommendation && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Recommendation</h4>
                  <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    message.data.recommendation === 'Buy' ? 'bg-green-100 text-green-800' :
                    message.data.recommendation === 'Sell' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {message.data.recommendation}
                  </div>
                </div>
              )}
              
              {message.data.pros && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Strengths</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {message.data.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-gray-600">{pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {message.data.cons && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Potential Risks</h4>
                  <ul className="list-disc list-inside space-y-1">
                    {message.data.cons.map((con, index) => (
                      <li key={index} className="text-sm text-gray-600">{con}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {message.data.prediction && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Price Target</h4>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      ${message.data.prediction.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">USD</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-1 text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export function Analysis({ data }: AnalysisProps) {
  const [newMessage, setNewMessage] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [data.messages]);

  return (
    <div className="bg-gray-50 rounded-lg shadow-sm">
      <div className="h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {data.messages.map((message) => (
            <Message key={message.id} message={message} />
          ))}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="border-t bg-white p-4">
          <form className="flex items-center space-x-4" onSubmit={(e) => {
            e.preventDefault();
            // Handle message submission here
            setNewMessage('');
          }}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Ask about the stock analysis..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}