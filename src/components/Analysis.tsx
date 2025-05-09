import React, { useEffect } from 'react';
import { ChevronDown, ChevronUp, User, Bot, Send, TrendingUp, TrendingDown, DollarSign, Activity, BarChart2, Percent, Clock, Globe } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StockData, ChatMessage, Company } from '../types';
import { toast } from 'react-hot-toast';
import { DATA_API_BASE_URL, PORTFOLIO_API_BASE_URL } from '../config/api';

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
    <div className={`flex items-start space-x-4 ${isAI ? 'justify-end' : 'justify-start'} mb-12`}>
      <div className={`flex-shrink-0 ${!isAI && 'order-2'}`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isAI ? 'bg-purple-100' : 'bg-blue-100'
        }`}>
          {isAI ? (
            <Bot className="h-6 w-6 text-purple-600" />
          ) : (
            <User className="h-6 w-6 text-blue-600" />
          )}
        </div>
      </div>
      <div className={`flex-1 ${isAI ? 'mr-4 order-1' : 'ml-4'}`}>
        <div className={`rounded-lg p-4 shadow-sm ${
          isAI ? 'bg-white border-2 border-gray-100' : 'bg-blue-50 border-2 border-blue-100'
        }`}>
          <p className="text-gray-800">{message.content}</p>
          
          {message.data && (
            <div className="mt-4 space-y-4">
              {message.data.sentiment && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-700">Predicted Change:</span>
                  <span className={`font-medium ${
                    message.data.recommendation === 'Buy' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {message.data.sentiment > 0 ? '+' : ''}{message.data.sentiment}%
                  </span>
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
                  <span className="font-medium text-gray-900">${message.data.prediction}</span>
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

const dummyResponses: { [key: string]: string } = {
  AAPL: "Based on my analysis, Apple shows strong fundamentals with robust iPhone sales and growing services revenue. The company maintains significant market share and brand loyalty.",
  MSFT: "Microsoft's cloud business continues to drive growth, with Azure showing strong momentum. The company's AI integration across products is promising.",
  GOOGL: "Alphabet demonstrates strong advertising revenue growth and cloud segment expansion. AI initiatives and diverse revenue streams provide stability.",
  AMZN: "Amazon's e-commerce dominance continues with AWS showing strong growth. Operational efficiency improvements and advertising revenue provide upside potential."
};

export function Analysis({ data }: AnalysisProps) {
  const [history, setHistory] = React.useState([]);
  const [news, setNews] = React.useState([]);
  const [media, setMedia] = React.useState([]);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [messages, setMessages] = React.useState<ChatMessage[]>(() => {
    try {
      // Try to get messages from localStorage
      const savedMessages = localStorage.getItem('analysisMessages');
      
      if (savedMessages) {
        // Parse the saved messages
        const parsedMessages = JSON.parse(savedMessages);
        
        // Convert timestamp strings back to Date objects
        return parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
      }
      
      return [];
    } catch (error) {
      console.error('Error loading messages from localStorage:', error);
      return [];
    }
  });
  const [newMessage, setNewMessage] = React.useState('');
  const [selectedCompany, setSelectedCompany] = React.useState<Company | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
  const [showCollapsible, setShowCollapsible] = React.useState(false);
  const [loadingStates, setLoadingStates] = React.useState({
    historical: false,
    news: false,
    social: false,
    result: false
  });
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
    (async () => {
      try {
        const allStockResponse = await fetch(`${PORTFOLIO_API_BASE_URL}/companies`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
          }
        });
        const allStockContent = await allStockResponse.json();
        
        const finalStockContent = allStockContent.map((eachData) => ({
          symbol: eachData.ticker_symbol,
          name: eachData.company_name,
          description: eachData.company_description
        }));
        
        setCompanies(finalStockContent);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    })();
  }, []);

  React.useEffect(() => {
    scrollToBottom();
    localStorage.setItem('analysisMessages', JSON.stringify(messages));
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
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    };

    if(messages.length < 2) {
      if (selectedCompany && newMessage.trim()) {
        setMessages(prev => [...prev, userMessage]);
        setShowCollapsible(true);
        
        // Set all loading states to true initially
        setLoadingStates({
          historical: true,
          news: true,
          social: true,
          result: true
        });

        // Historical Data API Call
        const historicalPromise = fetch(`${DATA_API_BASE_URL}/api/prediction/multistep/historical`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
          },
          body: JSON.stringify({
            "symbol": selectedCompany.symbol,
            "user_query": newMessage.trim()
          })
        }).then(async (response) => {
          const content = await response.json();
          const transformedHistoryData = content.data.historical_prices.map((eachData) => ({
            date: convertDate(eachData.date),
            price: eachData.price
          }));
          setHistory(transformedHistoryData.reverse());
          setLoadingStates(prev => ({ ...prev, historical: false }));
          setSections(prev => ({ ...prev, historicalPrice: true }));
        });

        // News API Call
        const newsPromise = fetch(`${DATA_API_BASE_URL}/api/prediction/multistep/news`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
          },
          body: JSON.stringify({
            "symbol": selectedCompany.symbol,
            "user_query": newMessage.trim()
          })
        }).then(async (response) => {
          const newsContent = await response.json();
          const transformedNewsData = newsContent.data.articles.map((eachData) => ({
            title: eachData.title,
            source: eachData.source,
            date: formatNewsDate(eachData.published),
            link: eachData.link,
          }));
          setNews(transformedNewsData);
          setLoadingStates(prev => ({ ...prev, news: false }));
          setSections(prev => ({ ...prev, news: true }));
        });

        // Social Media API Call
        const socialPromise = fetch(`${DATA_API_BASE_URL}/api/prediction/multistep/socialmedia`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
          },
          body: JSON.stringify({
            "symbol": selectedCompany.symbol,
            "user_query": newMessage.trim()
          })
        }).then(async (response) => {
          const socialMediaContent = await response.json();
          const transformedMediaData = socialMediaContent.data.posts.map((eachData) => ({
            platform: "Reddit",
            user: eachData.author,
            content: eachData.title,
            sentiment: eachData.sentiment,
            date: formatNewsDate(eachData.created)
          }));
          setMedia(transformedMediaData);
          setLoadingStates(prev => ({ ...prev, social: false }));
          setSections(prev => ({ ...prev, social: true }));
        });

        // Result API Call
        const resultPromise = fetch(`${DATA_API_BASE_URL}/api/prediction/multistep/result`, {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
          },
          body: JSON.stringify({
            "symbol": selectedCompany.symbol,
            "user_query": newMessage.trim()
          })
        }).then(async (response) => {
          const resultContent = await response.json();
          const transformedResultData = resultContent.data.structured_output;
          
          const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            type: 'ai',
            content: transformedResultData.analysis,
            timestamp: new Date(),
            data: !showCollapsible ? {
              sentiment: transformedResultData["predicted_percentage_change"],
              recommendation: transformedResultData['predicted_direction'] === 'Up' ? 'Buy' : 'Sell',
              pros: Array.isArray(transformedResultData["positive_developments"]) ? transformedResultData["positive_developments"] : transformedResultData["positive_developments"].split(','),
              cons: Array.isArray(transformedResultData["potential_concerns"]) ? transformedResultData["potential_concerns"] : transformedResultData["potential_concerns"].split(','),
              prediction: transformedResultData["predicted_price"]
            } : undefined
          };
          
          setMessages(prev => [...prev, aiMessage]);
          setLoadingStates(prev => ({ ...prev, result: false }));
        });

        // Handle any errors
        Promise.all([historicalPromise, newsPromise, socialPromise, resultPromise])
          .catch(error => {
            console.error('Error fetching data:', error);
            toast.error('Error fetching data. Please try again.');
            setLoadingStates({
              historical: false,
              news: false,
              social: false,
              result: false
            });
          });

        setNewMessage('');
      }
    } else {
      console.log("here---2")
      const followUpResponse = await fetch(`${DATA_API_BASE_URL}/api/prediction/multistep/followup`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization':`Bearer ${JSON.parse(localStorage.getItem('user')).accessToken}`
        },
        body: JSON.stringify({
          "symbol": selectedCompany?.symbol,
          "user_query": newMessage.trim()
      })
      });
      const followUpcontent = await followUpResponse.json();
      console.log(followUpcontent)

      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: followUpcontent.llm_response,
        timestamp: new Date(),
        data:  undefined
      };

      setMessages(prev => [...prev, userMessage, aiMessage]);
      setNewMessage('');
    }
  };

  useEffect(()=>{
    console.log(messages)
  },[messages])

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

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-gray-50 border-2 border-blue-200 rounded-lg shadow-lg">
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-4 pb-6 pt-6"
        style={{ display: 'flex', flexDirection: 'column-reverse' }}
      >
        <div className="space-y-8">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-16rem)] text-center p-8">
              <Bot className="h-24 w-24 text-gray-400 mb-6" />
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Welcome to TheStockAI</h3>
              <p className="text-lg text-gray-500 max-w-2xl leading-relaxed">
                Select a stock from the dropdown and enter your query to begin your analysis. 
                You can ask about price predictions, market trends, or get detailed insights about any stock.
              </p>
            </div>
          ) : (
            messages.map((message, index) => (
              <React.Fragment key={message.id}>
                {index === 1 && showCollapsible && message.type === 'ai' && (
                  <div className="space-y-6 mb-12">
                    {Object.values(loadingStates).some(state => state) && (
                      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                        <h4 className="text-sm font-medium text-gray-900 mb-4">Analyzing your request...</h4>
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${loadingStates.historical ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <span className="text-sm text-gray-600">Getting Historical Price Graph</span>
                            {loadingStates.historical && (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${loadingStates.news ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <span className="text-sm text-gray-600">Analyzing News Analysis</span>
                            {loadingStates.news && (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${loadingStates.social ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <span className="text-sm text-gray-600">Comparing Social Media Sentiment</span>
                            {loadingStates.social && (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                            )}
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full ${loadingStates.result ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                            <span className="text-sm text-gray-600">Evaluating Result</span>
                            {loadingStates.result && (
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    <CollapsibleSection
                      title="Historical Price Graph"
                      isOpen={sections.historicalPrice}
                      onToggle={() => toggleSection('historicalPrice')}
                    >
                      <div className="h-[400px] bg-white rounded-lg p-4">
                        {loadingStates.historical ? (
                          <div className="h-full flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                          </div>
                        ) : (
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
                        )}
                      </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                      title="News Analysis"
                      isOpen={sections.news}
                      onToggle={() => toggleSection('news')}
                    >
                      <div className="space-y-4">
                        {loadingStates.news ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                          </div>
                        ) : (
                          news.map((news, index) => (
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
                          ))
                        )}
                      </div>
                    </CollapsibleSection>

                    <CollapsibleSection
                      title="Social Media Sentiment"
                      isOpen={sections.social}
                      onToggle={() => toggleSection('social')}
                    >
                      <div className="space-y-4">
                        {loadingStates.social ? (
                          <div className="flex items-center justify-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                          </div>
                        ) : (
                          media.map((post, index) => (
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
                          ))
                        )}
                      </div>
                    </CollapsibleSection>
                  </div>
                )}
                <div className={`flex items-start space-x-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-12`}>
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'order-2' : ''}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      message.type === 'ai' ? 'bg-purple-100' : 'bg-blue-100'
                    }`}>
                      {message.type === 'ai' ? (
                        <Bot className="h-6 w-6 text-purple-600" />
                      ) : (
                        <User className="h-6 w-6 text-blue-600" />
                      )}
                    </div>
                  </div>
                  <div className={`flex-1 ${message.type === 'user' ? 'mr-4 order-1' : 'ml-4'}`}>
                    <div className={`rounded-lg p-4 shadow-sm ${
                      message.type === 'ai' ? 'bg-white border-2 border-gray-100' : 'bg-blue-50 border-2 border-blue-100'
                    }`}>
                      <p className="text-gray-800">{message.content}</p>
                      
                      {message.data && (
                        <div className="mt-4 space-y-4">
                          {message.data.sentiment && (
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-gray-700">Predicted Change:</span>
                              <span className={`font-medium ${
                                message.data.recommendation === 'Buy' ? 'text-green-600' : 'text-red-600'
                              }`}>
                                {message.data.sentiment > 0 ? '+' : ''}{message.data.sentiment}
                              </span>
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
                              <span className="font-medium text-gray-900">{message.data.prediction}</span>
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
              </React.Fragment>
            ))
          )}
        </div>
      </div>

      <div className="sticky bottom-0 bg-white border-t-2 border-gray-200 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form className="flex flex-row items-center space-x-4" onSubmit={handleSubmit}>
            <button
              type="button"
              onClick={() => {
                setMessages([])
                localStorage.removeItem('analysisMessages')
                setShowCollapsible(false)
              }}
              className="px-4 py-2.5 bg-gray-200 border-2 border-gray-200 rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors whitespace-nowrap"
            >
              New chat
            </button>
            <div className="w-1/3 relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-2.5 bg-white border-2 border-gray-200 rounded-lg text-left text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors flex items-center justify-between"
              >
                {selectedCompany ? (
                  <div className="flex items-center justify-between w-full">
                    <div>
                      <span className="font-medium text-gray-900">{selectedCompany.symbol}</span>
                      <span className="ml-2 text-sm text-gray-500">{selectedCompany.name}</span>
                    </div>
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  </div>
                ) : (
                  <div className="flex items-center justify-between w-full">
                    <span>Select company</span>
                    <ChevronUp className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </button>
              
              {isDropdownOpen && (
                <div className="absolute bottom-full mb-1 w-full bg-white border-2 border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {companies.map((company) => (
                    <button
                      key={company.symbol}
                      type="button"
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 text-sm transition-colors border-b border-gray-100 last:border-0"
                      onClick={() => {
                        setSelectedCompany(company);
                        setIsDropdownOpen(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium text-gray-900">{company.symbol}</span>
                          <span className="ml-2 text-sm text-gray-500">{company.name}</span>
                        </div>
                        {selectedCompany?.symbol === company.symbol && (
                          <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      {company.description && (
                        <p className="mt-1 text-sm text-gray-500 line-clamp-1">{company.description}</p>
                      )}
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
              className="w-1/2 px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 hover:border-gray-300 transition-colors"
            />
            
            <button
              type="submit"
              disabled={!selectedCompany || !newMessage.trim() || Object.values(loadingStates).some(state => state)}
              className="px-6 py-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {Object.values(loadingStates).some(state => state) ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Loading...</span>
                </div>
              ) : (
                <Send className="h-5 w-5" />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
