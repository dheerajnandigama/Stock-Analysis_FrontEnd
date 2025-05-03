import React from 'react';
import { Mail, MapPin, Target, TrendingUp, Calendar, Activity, Award, Edit2, Camera } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const monthlyReturns = Array.from({ length: 6 }, (_, i) => ({
  month: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'][i],
  profit: Math.floor(Math.random() * 15 + 5),
  loss: Math.floor(Math.random() * 8 + 2),
}));

const tradingStats = [
  { name: 'Win Rate', value: '72%', trend: '+8%', color: 'text-green-500', icon: Target },
  { name: 'Avg Return', value: '15.4%', trend: '+3.2%', color: 'text-green-500', icon: TrendingUp },
  { name: 'Total Trades', value: '189', trend: '+31', color: 'text-blue-500', icon: Activity },
  { name: 'Active Since', value: '2023', trend: '1.5 years', color: 'text-gray-500', icon: Calendar },
];

const achievements = [
  { title: 'Top Performer', date: '2024' },
  { title: 'Risk Expert', date: '2023' },
  { title: 'Consistent', date: '2023' },
];

export function Profile() {
  const [isEditing, setIsEditing] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div 
          className="h-32 bg-cover bg-center" 
          style={{
            backgroundImage: `url('https://images.pexels.com/photos/186461/pexels-photo-186461.jpeg')`,
            backgroundBlendMode: 'overlay',
            backgroundColor: 'rgba(0, 0, 0, 0.5)'
          }}
        >
          <div className="h-full w-full bg-gradient-to-r from-blue-600/80 to-purple-600/80"></div>
        </div>
        <div className="px-8 pb-8">
          <div className="relative flex justify-between">
            <div className="flex space-x-6">
              <div className="relative -mt-16">
                <div className="relative">
                  <img
                    src="https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg"
                    alt="Dheeraj Nandigama"
                    className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                  {isEditing && (
                    <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg text-gray-600 hover:text-blue-600">
                      <Camera className="h-5 w-5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="pt-4">
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue="Dheeraj Nandigama"
                    className="text-2xl font-bold text-gray-900 bg-gray-50 border border-gray-200 rounded px-3 py-1 mb-1 w-full"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-gray-900">Dheeraj Nandigama</h2>
                )}
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue="Senior Stock Analyst"
                    className="text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-1 w-full"
                  />
                ) : (
                  <p className="text-gray-600">Senior Stock Analyst</p>
                )}
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="inline-flex items-center px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                {isEditing ? 'Save Profile' : 'Edit Profile'}
              </button>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="email"
                    defaultValue="dheeraj.n@example.com"
                    className="flex-1 text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-1"
                  />
                ) : (
                  <span className="text-gray-600">dheeraj.n@example.com</span>
                )}
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                {isEditing ? (
                  <input
                    type="text"
                    defaultValue="New York, USA"
                    className="flex-1 text-gray-600 bg-gray-50 border border-gray-200 rounded px-3 py-1"
                  />
                ) : (
                  <span className="text-gray-600">New York, USA</span>
                )}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                >
                  <Award className="h-4 w-4 mr-1 text-blue-500" />
                  <span className="font-medium">{achievement.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {tradingStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-500">{stat.name}</h4>
              <stat.icon className="h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-2xl font-bold text-gray-900">{stat.value}</span>
              <span className={`text-sm ${stat.color}`}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-lg font-semibold mb-6">Monthly Performance</h3>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyReturns}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="profit" name="Profit %" fill="#10B981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="loss" name="Loss %" fill="#EF4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}