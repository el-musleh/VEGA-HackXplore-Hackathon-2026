import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Download, TrendingUp, Droplets, Banknote, Calendar } from 'lucide-react';

// Mock Data for Analytics
const waterUsageData = [
  { name: 'Jan', city: 4000, volunteer: 1200 },
  { name: 'Feb', city: 3000, volunteer: 1500 },
  { name: 'Mar', city: 2000, volunteer: 2500 },
  { name: 'Apr', city: 5000, volunteer: 4000 },
  { name: 'May', city: 8000, volunteer: 7500 },
  { name: 'Jun', city: 12000, volunteer: 15000 } // Summer spike, citizens take over!
];

const costSavingsData = [
  { name: 'Jan', saved: 450 },
  { name: 'Feb', saved: 600 },
  { name: 'Mar', saved: 1100 },
  { name: 'Apr', saved: 2200 },
  { name: 'May', saved: 4500 },
  { name: 'Jun', saved: 9200 } 
];

const heatIslandData = [
  { name: 'Week 1', Innenstadt: 15, Durlach: 35, Südstadt: 25 },
  { name: 'Week 2', Innenstadt: 12, Durlach: 32, Südstadt: 22 },
  { name: 'Week 3', Innenstadt: 8, Durlach: 25, Südstadt: 15 },
  { name: 'Week 4', Innenstadt: 5, Durlach: 15, Südstadt: 10 }
];

export default function AdminAnalytics() {
  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Analytics & Reporting</h1>
          <p className="text-gray-500 mt-1">Deep insights into water consumption, financial impact, and urban climate trends.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold flex items-center shadow-sm hover:bg-gray-50 transition-colors">
            <Calendar className="mr-2" size={18} />
            Last 6 Months
          </button>
          <button className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold flex items-center shadow-lg hover:bg-gray-800 transition-colors">
            <Download className="mr-2" size={18} />
            Export CSV
          </button>
        </div>
      </header>

      {/* Top Stat Cards */}
      <div className="grid grid-cols-3 gap-6 shrink-0">
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl flex items-center">
          <div className="w-12 h-12 bg-water-drop-blue/10 rounded-2xl flex items-center justify-center mr-4">
            <Droplets className="text-water-drop-blue" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total Water (6M)</p>
            <p className="text-2xl font-black text-gray-900">65,700 L</p>
          </div>
        </div>
        
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl flex items-center">
          <div className="w-12 h-12 bg-earthy-green/10 rounded-2xl flex items-center justify-center mr-4">
            <Banknote className="text-earthy-green" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Est. Cost Savings</p>
            <p className="text-2xl font-black text-gray-900">€18,050</p>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl flex items-center">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mr-4">
            <TrendingUp className="text-orange-500" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Heat Island Risk</p>
            <p className="text-2xl font-black text-gray-900">Innenstadt-Ost</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-6 min-h-0">
        
        {/* Water Usage Chart */}
        <div className="bg-white border border-gray-100 rounded-3xl shadow-xl p-6 flex flex-col min-h-0">
          <h2 className="text-lg font-black text-gray-900 mb-1">Watering Volume: City vs. Citizens</h2>
          <p className="text-sm text-gray-500 mb-6">Comparison of water dispatched via city trucks vs. volunteer efforts (Liters).</p>
          
          <div className="flex-1 min-h-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={waterUsageData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12, fontWeight: 'bold'}} />
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  cursor={{fill: '#F3F4F6'}}
                />
                <Bar dataKey="city" name="City Trucks (L)" stackId="a" fill="#3B82F6" radius={[0, 0, 4, 4]} />
                <Bar dataKey="volunteer" name="Citizens (L)" stackId="a" fill="#22C55E" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right side: stacked charts */}
        <div className="flex flex-col space-y-6 min-h-0">
          
          {/* Cost Savings */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-xl p-6 flex flex-col flex-1 min-h-0">
            <h2 className="text-lg font-black text-gray-900 mb-1">Financial Offset</h2>
            <p className="text-sm text-gray-500 mb-4">Money saved from reduced truck dispatches (€).</p>
            
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={costSavingsData}>
                  <defs>
                    <linearGradient id="colorSaved" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#22C55E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold'}} />
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="saved" name="Saved (€)" stroke="#22C55E" strokeWidth={3} fillOpacity={1} fill="url(#colorSaved)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Tree Health Trends (Heat Islands) */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-xl p-6 flex flex-col flex-1 min-h-0">
            <h2 className="text-lg font-black text-gray-900 mb-1">Heat Island Stress Index</h2>
            <p className="text-sm text-gray-500 mb-4">Average moisture % dropping across key districts.</p>
            
            <div className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={heatIslandData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold'}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 10, fontWeight: 'bold'}} domain={[0, 40]} />
                  <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
                  <Line type="monotone" dataKey="Innenstadt" stroke="#EF4444" strokeWidth={3} dot={{r: 4, fill: '#EF4444', strokeWidth: 0}} />
                  <Line type="monotone" dataKey="Südstadt" stroke="#F59E0B" strokeWidth={3} dot={{r: 4, fill: '#F59E0B', strokeWidth: 0}} />
                  <Line type="monotone" dataKey="Durlach" stroke="#3B82F6" strokeWidth={3} dot={{r: 4, fill: '#3B82F6', strokeWidth: 0}} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
