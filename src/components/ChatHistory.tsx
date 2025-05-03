import React from 'react';
import { MessageSquare, ChevronDown, Bot, User } from 'lucide-react';
import { ChatHistory as ChatHistoryType } from '../types';

const dummyHistory: ChatHistoryType[] = [
  {
    id: '1',
    timestamp: new Date('2024-03-10T14:30:00'),
    symbol: 'AAPL',
    query: 'What is the current market sentiment for Apple stock and how does it compare to industry peers?'
  },
  {
    id: '2',
    timestamp: new Date('2024-03-09T16:45:00'),
    symbol: 'MSFT',
    query: 'Analyze Microsoft\'s cloud services growth and potential impact on stock performance'
  },
  {
    id: '3',
    timestamp: new Date('2024-03-08T11:20:00'),
    symbol: 'TSLA',
    query: 'What are the key technical indicators for Tesla stock considering recent market volatility?'
  },
  {
    id: '4',
    timestamp: new Date('2024-03-07T09:15:00'),
    symbol: 'NVDA',
    query: 'How is NVIDIA positioned in the AI chip market and what\'s the growth forecast?'
  },
  {
    id: '5',
    timestamp: new Date('2024-03-06T15:20:00'),
    symbol: 'META',
    query: 'Analyze Meta\'s revenue streams and potential impact of AI integration'
  },
  {
    id: '6',
    timestamp: new Date('2024-03-05T10:30:00'),
    symbol: 'AMZN',
    query: 'What\'s the outlook for Amazon\'s AWS division and retail business?'
  },
  {
    id: '7',
    timestamp: new Date('2024-03-04T13:45:00'),
    symbol: 'GOOGL',
    query: 'How is Google Cloud performing against competitors and what\'s the market share trend?'
  },
  {
    id: '8',
    timestamp: new Date('2024-03-03T11:00:00'),
    symbol: 'AMD',
    query: 'Compare AMD\'s product pipeline with competitors and analyze market potential'
  }
];

const mockResponses: Record<string, string> = {
  'AAPL': 'Based on the analysis, AAPL shows strong market sentiment with a bullish trend in technical indicators. The stock has maintained consistent growth with a P/E ratio indicating reasonable valuation compared to peers.',
  'MSFT': 'Microsoft demonstrates robust growth potential in cloud services, with Azure revenue growing 30% YoY. Technical indicators suggest a strong upward trend with solid fundamentals.',
  'TSLA': 'Tesla shows mixed signals with high volatility. While technical indicators suggest short-term bearish trends, long-term growth potential remains strong based on EV market expansion.',
  'NVDA': 'NVIDIA maintains significant momentum in AI chips, with a dominant market position. Technical analysis indicates strong buy signals with potential for continued upward movement.',
  'META': 'Meta\'s pivot to AI and metaverse shows promising results. Revenue diversification and cost optimization efforts are positively impacting stock performance.',
  'AMZN': 'Amazon\'s AWS maintains market leadership in cloud services, while retail segments show recovery. Technical indicators suggest a bullish trend with strong support levels.',
  'GOOGL': 'Google Cloud\'s market share is expanding, with improved profitability metrics. Technical analysis shows positive momentum with strong institutional buying.',
  'AMD': 'AMD\'s competitive position in both consumer and data center markets remains strong. Technical indicators suggest potential breakout opportunities.'
};

interface ChatHistoryProps {
  history: ChatHistoryType[];
  onSelect: (chat: ChatHistoryType) => void;
}

export function ChatHistory({ history = dummyHistory, onSelect }: ChatHistoryProps) {
  const [selectedChat, setSelectedChat] = React.useState<ChatHistoryType | null>(null);

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-6 border-b">
        <h2 className="text-xl font-semibold text-gray-900">Chat History</h2>
        <p className="text-sm text-gray-500 mt-1">Your previous stock analysis conversations</p>
      </div>

      <div className="divide-y">
        {history.map((chat) => (
          <div
            key={chat.id}
            className={`p-6 hover:bg-gray-50 cursor-pointer transition-colors ${
              selectedChat?.id === chat.id ? 'bg-blue-50' : ''
            }`}
            onClick={() => {
              setSelectedChat(chat);
              onSelect(chat);
            }}
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">
                    {chat.symbol}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDate(chat.timestamp)}
                  </p>
                </div>
                <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                  {chat.query}
                </p>

                {selectedChat?.id === chat.id && (
                  <div className="mt-4 space-y-4">
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-gray-400 mt-1" />
                      <div className="flex-1 bg-blue-50 rounded-lg p-3">
                        <p className="text-sm text-gray-800">{chat.query}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-3">
                      <Bot className="h-5 w-5 text-purple-600 mt-1" />
                      <div className="flex-1 bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-sm text-gray-800">
                          {mockResponses[chat.symbol]}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {history.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            <MessageSquare className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <p>No chat history yet. Start analyzing stocks to see your conversations here.</p>
          </div>
        )}
      </div>
    </div>
  );
}