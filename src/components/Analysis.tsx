import React from 'react';
import { ChevronDown, ChevronUp, User, Bot, Send, TrendingUp, TrendingDown, DollarSign, Activity, BarChart2, Percent, Clock, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockData, ChatMessage, Company } from '../types';

function convertDate(dateString) {
  // Split the date string to extract year, month, and day
  const [year, month, day] = dateString.split('-').map(num => parseInt(num, 10));
  
  // Create a date using local time (months are 0-indexed in JavaScript)
  const date = new Date(year, month - 1, day);
  
  // Get the month name
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const monthName = monthNames[date.getMonth()];
  const dayNum = date.getDate();
  
  // Return the formatted date
  return `${monthName} ${dayNum}`;
}

function formatNewsDate(input) {
  const date = new Date(input);

  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'long' }); // "May"
  const year = date.getFullYear();
  const time = date.toTimeString().split(' ')[0]; // "20:10:12"

  return `${day} ${month} ${year} ${time}`;
}

interface AnalysisProps {
  data: StockData;
}

interface CollapsibleSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  isOpen,
  onToggle,
  children
}) => (
  <div className="bg-white rounded-lg shadow-sm mb-4">
    <button
      onClick={onToggle}
      className="w-full px-6 py-4 flex items-center justify-between text-left"
    >
      <span className="font-medium text-gray-900">{title}</span>
      {isOpen ? (
        <ChevronUp className="h-5 w-5 text-gray-400" />
      ) : (
        <ChevronDown className="h-5 w-5 text-gray-400" />
      )}
    </button>
    {isOpen && <div className="px-6 pb-6">{children}</div>}
  </div>
);

const Message: React.FC<{ message: ChatMessage }> = ({ message }) => {
  const isAI = message.type === 'ai';
  
  return (
    <div className={`flex items-start space-x-3 ${isAI ? 'justify-start' : 'justify-end'} mb-12`}>
      <div className={`flex-shrink-0 ${!isAI && 'order-2'}`}>
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
      <div className={`flex-1 ${isAI ? 'mr-12' : 'ml-12 order-1'}`}>
        <div className={`rounded-lg p-4 shadow-sm ${
          isAI ? 'bg-white border-2 border-gray-100' : 'bg-blue-50 border-2 border-blue-100'
        }`}>
          <p className="text-gray-800">{message.content}</p>
          
          {message.data && (
            <div className="mt-4 space-y-4">
              {message.data.sentiment && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Sentiment:</span>
                  <span className={`font-medium ${
                    message.data.sentiment >= 70 ? 'text-green-600' : 
                    message.data.sentiment >= 30 ? 'text-yellow-600' : 
                    'text-red-600'
                  }`}>{message.data.sentiment}%</span>
                </div>
              )}
              
              {message.data.recommendation && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Recommendation:</span>
                  <span className={`px-2 py-1 rounded-full text-sm font-medium ${
                    message.data.recommendation === 'Buy' ? 'bg-green-100 text-green-800' :
                    message.data.recommendation === 'Sell' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>{message.data.recommendation}</span>
                </div>
              )}
              
              {message.data.pros && message.data.pros.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Key Strengths:</span>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    {message.data.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-gray-600">{pro}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {message.data.cons && message.data.cons.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-700">Potential Risks:</span>
                  <ul className="mt-1 list-disc list-inside space-y-1">
                    {message.data.cons.map((con, index) => (
                      <li key={index} className="text-sm text-gray-600">{con}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {message.data.prediction && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Price Target:</span>
                  <span className="font-medium text-gray-900">${message.data.prediction.toFixed(2)}</span>
                </div>
              )}
            </div>
          )}
        </div>
        <div className="mt-2 text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

const companies: Company[] = [
  { 
    symbol: 'AAPL', 
    name: 'Apple Inc.',
    description: 'Apple Inc. designs, manufactures, and markets smartphones, personal computers, tablets, and wearables.'
  },
  { 
    symbol: 'MSFT', 
    name: 'Microsoft Corporation',
    description: 'Microsoft develops, licenses, and supports software, services, devices, and solutions worldwide.'
  },
  { 
    symbol: 'GOOGL', 
    name: 'Alphabet Inc.',
    description: 'Alphabet is the parent company of Google, offering online advertising, search, cloud computing, and more.'
  },
  { 
    symbol: 'AMZN', 
    name: 'Amazon.com, Inc.',
    description: 'Amazon is an e-commerce and cloud computing giant providing retail and web services.'
  }
];

const dummyResponses: { [key: string]: string } = {
  AAPL: "Based on my analysis, Apple shows strong fundamentals with robust iPhone sales and growing services revenue. The company maintains significant market share and brand loyalty.",
  MSFT: "Microsoft's cloud business continues to drive growth, with Azure showing strong momentum. The company's AI integration across products is promising.",
  GOOGL: "Alphabet demonstrates strong advertising revenue growth and cloud segment expansion. AI initiatives and diverse revenue streams provide stability.",
  AMZN: "Amazon's e-commerce dominance continues with AWS showing strong growth. Operational efficiency improvements and advertising revenue provide upside potential."
};

export function Analysis({ data }: AnalysisProps) {
  const [history,setHistory] = React.useState([]);
  const [news,setNews] = React.useState([]);
  const [media,setMedia] = React.useState([]);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = React.useState('');
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [showCollapsible, setShowCollapsible] = React.useState(false);
  const [sections, setSections] = React.useState({
    historicalPrice: false,
    marketOverview: false,
    news: false,
    social: false
  });
  const chatContainerRef = React.useRef<HTMLDivElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const toggleSection = (section: keyof typeof sections) => {
    setSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedCompany && newMessage.trim()) {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'user',
        content: newMessage,
        timestamp: new Date()
      };

      const rawResponse = await fetch('http://127.0.0.1:5001/api/prediction/multistep/historical', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
        },
        body: JSON.stringify({
          "symbol": selectedCompany.symbol,
          "user_query": newMessage.trim()
      })
      });
      const content = await rawResponse.json();
      console.log(content)

      const transformedHistoryData = content.data.historical_prices.map((eachData)=>{
        return {
          date: convertDate(eachData.date),
          price: eachData.price
        }
      })

      console.log(transformedHistoryData)

      setHistory(transformedHistoryData.reverse())

      const newsResponse = await fetch('http://127.0.0.1:5001/api/prediction/multistep/news', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
        },
        body: JSON.stringify({
          "symbol": selectedCompany.symbol,
          "user_query": newMessage.trim()
      })
      });
      const newsContent = await newsResponse.json();
      console.log(newsContent)

      const transformedNewsData = newsContent.data.articles.map((eachData)=>{
        return {
          title: eachData.title,
          source: eachData.source,
          date: formatNewsDate(eachData.published),
          link: eachData.link,
        }
      })

      console.log(transformedNewsData)
      setNews(transformedNewsData)

      const mediaResponse = await fetch('http://127.0.0.1:5001/api/prediction/multistep/socialmedia', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
        },
        body: JSON.stringify({
          "symbol": selectedCompany.symbol,
          "user_query": newMessage.trim()
      })
      });
      const socialMediaContent = await mediaResponse.json();
      console.log(socialMediaContent)

      const transformedMediaData = socialMediaContent.data.posts.map((eachData)=>{
        return {
          platform: "Reddit",
          user: eachData.author,
          content: eachData.title,
          sentiment: eachData.sentiment,
          date: formatNewsDate(eachData.created)
        }
      })

      console.log(transformedMediaData)
      setMedia(transformedMediaData)



      // {
      //   date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      //   price: +(basePrice + randomChange).toFixed(2)
      // }

      
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: dummyResponses[selectedCompany.symbol] || "I'm analyzing the stock data...",
        timestamp: new Date(),
        data: !showCollapsible ? {
          sentiment: 75,
          recommendation: 'Buy',
          pros: ['Strong market position', 'Innovation leadership'],
          cons: ['Market competition', 'Economic uncertainties'],
          prediction: 185.50
        } : undefined
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      if (!showCollapsible) {
        setShowCollapsible(true);
      }
      setNewMessage('');
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900">{label}</p>
          <p className="text-sm text-gray-600">
            Price: <span className="font-medium">${payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const getMarketData = (symbol: string) => {
    return marketData[symbol as keyof typeof marketData] || marketData.AAPL;
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-gray-50">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-6"
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
      >
        <div className="space-y-8">
          {messages.map((message, index) => (
            <React.Fragment key={message.id}>
              
              {index === 1 && showCollapsible && message.type === 'ai' && (
                <div className="space-y-6 mb-12">
                  <CollapsibleSection
                    title="Historical Price Graph"
                    isOpen={sections.historicalPrice}
                    onToggle={() => toggleSection('historicalPrice')}
                  >
                    <div className="h-[400px] bg-white rounded-lg p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={history}
                          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis
                            dataKey="date"
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickLine={{ stroke: '#E5E7EB' }}
                          />
                          <YAxis
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickLine={{ stroke: '#E5E7EB' }}
                            domain={['dataMin - 5', 'dataMax + 5']}
                          />
                          <Tooltip content={<CustomTooltip />} />
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={false}
                            activeDot={{ r: 6, fill: '#3B82F6', stroke: '#fff', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CollapsibleSection>

                  

                  <CollapsibleSection
                    title="News Analysis"
                    isOpen={sections.news}
                    onToggle={() => toggleSection('news')}
                  >
                    <div className="space-y-4">
                      {news.map((news, index) => (
                        <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{news.title}</h4>
                              <div className="flex items-center space-x-3 mt-1">
                                <span className="text-sm text-gray-500">{news.source}</span>
                                <span className="text-sm text-gray-500">{news.date}</span>
                              </div>
                             
                            </div>
                          </div>
                          <span>
                          <p className="mt-2 text-sm text-blue-600 underline break-all cursor-pointer"
                                onClick={() => window.open(news.link, '_blank')}>
                                  {news.link}
                          </p>
                          </span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>

                  <CollapsibleSection
                    title="Social Media Sentiment"
                    isOpen={sections.social}
                    onToggle={() => toggleSection('social')}
                  >
                    <div className="space-y-4">
                      {media.map((post, index) => (
                        <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                          <div className="flex items-start space-x-4">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900">@{post.user}</span>
                                <span className="text-sm text-gray-500">on {post.platform}</span>
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                    post.sentiment > 0 ? 'bg-green-100 text-green-800' :
                                    post.sentiment < 0 ? 'bg-red-100 text-red-800' :
                                      'bg-yellow-100 text-yellow-800'
                                    }`}>
                                    {post.sentiment > 0 ? 'positive' : post.sentiment < 0 ? 'negative' : 'neutral'}
                                </span>
                              </div>
                              <p className="mt-2 text-gray-600">{post.content}</p>
                              <div className="mt-2 text-sm text-gray-500">
                                {post.date}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                </div>
              )}
              <Message message={message} />
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form className="flex items-center space-x-4" onSubmit={handleSubmit}>
            <div className="w-1/5 relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors"
              >
                {selectedCompany ? selectedCompany.symbol : 'Select company'}
              </button>
              
              {isDropdownOpen && (
                <div className="absolute bottom-full mb-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {companies.map((company) => (
                    <button
                      key={company.symbol}
                      type="button"
                      className="w-full px-4 py-2.5 text-left hover:bg-gray-50 text-sm transition-colors"
                      onClick={() => {
                        setSelectedCompany(company);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {company.symbol} - {company.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter your analysis query..."
              className="flex-1 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors"
            />
            
            <button
              type="submit"
              disabled={!selectedCompany || !newMessage.trim()}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}