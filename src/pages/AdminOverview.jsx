import { Droplet, Users, Truck, AlertTriangle, Activity, Wifi, WifiOff } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';

export default function AdminOverview() {
  const { trees } = useOutletContext();
  
  const totalTrees = trees.length;
  // Trees that need water today
  const criticalTrees = trees.filter(t => t.moisture < 20).length;
  
  // Mock Data for the requirements
  const offlineSensors = Math.floor(totalTrees * 0.08); // 8% offline
  const onlineSensors = totalTrees - offlineSensors;
  const activeDrivers = 12;
  const totalDrivers = 15;
  const taskCompletion = 68; // 68%
  const volunteerGallons = 12500; // Gallons (or Liters)

  const pieData = [
    { name: 'Online Sensors', value: onlineSensors, color: '#22c55e' }, // earthy-green
    { name: 'Offline / Error', value: offlineSensors, color: '#ef4444' } // red-500
  ];

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">City Pulse Overview</h1>
        <p className="text-gray-500 mt-1">High-level status of the city's trees, hardware, and workforce.</p>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white border border-red-100 rounded-3xl p-6 shadow-xl shadow-red-100 relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <AlertTriangle size={100} />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={20} />
            </div>
            <span className="text-xs font-bold text-red-400 uppercase tracking-widest">Urgent</span>
          </div>
          <p className="text-3xl font-black text-gray-900 relative z-10">{criticalTrees}</p>
          <p className="text-sm text-gray-500 font-medium mt-1 relative z-10">Critical Trees & Offline Sensors</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Truck size={100} />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
              <Truck className="text-blue-500" size={20} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Workforce</span>
          </div>
          <p className="text-3xl font-black text-gray-900 relative z-10">{activeDrivers} <span className="text-lg text-gray-400">/ {totalDrivers}</span></p>
          <div className="flex items-center justify-between mt-1 relative z-10">
            <p className="text-sm text-gray-500 font-medium">Active Drivers</p>
            <span className="text-xs font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-full">{taskCompletion}% Done</span>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Users size={100} />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 bg-water-drop-blue/10 rounded-xl flex items-center justify-center">
              <Users className="text-water-drop-blue" size={20} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Community</span>
          </div>
          <p className="text-3xl font-black text-gray-900 relative z-10">{volunteerGallons.toLocaleString()} L</p>
          <p className="text-sm text-gray-500 font-medium mt-1 relative z-10">Watered by Volunteers (This Week)</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5">
            <Activity size={100} />
          </div>
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="w-10 h-10 bg-earthy-green/10 rounded-xl flex items-center justify-center">
              <Activity className="text-earthy-green" size={20} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Health</span>
          </div>
          <p className="text-3xl font-black text-gray-900 relative z-10">{totalTrees}</p>
          <p className="text-sm text-gray-500 font-medium mt-1 relative z-10">Total Deployed Sensors</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* System Health Pie Chart */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl flex flex-col col-span-1">
          <h2 className="text-lg font-black text-gray-900 mb-2">System Health</h2>
          <p className="text-sm text-gray-500 font-medium mb-6">IoT Sensor connection status</p>
          
          <div className="flex-1 h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-black text-gray-900">{Math.round((onlineSensors/totalTrees)*100)}%</span>
              <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Online</span>
            </div>
          </div>
          
          <div className="mt-4 space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm font-bold text-gray-700">
                <Wifi size={16} className="text-earthy-green mr-2" /> Online
              </div>
              <span className="text-sm font-black">{onlineSensors}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm font-bold text-gray-700">
                <WifiOff size={16} className="text-red-500 mr-2" /> Offline/Error
              </div>
              <span className="text-sm font-black">{offlineSensors}</span>
            </div>
          </div>
        </div>

        {/* Quick Actions / Recent Alerts */}
        <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-xl flex flex-col col-span-2">
          <h2 className="text-lg font-black text-gray-900 mb-6">Recent Critical Alerts</h2>
          
          <div className="space-y-4 flex-1">
            {trees.filter(t => t.moisture < 10).slice(0, 4).map((tree, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <AlertTriangle className="text-red-600" size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{tree.name} (#{tree.id})</h3>
                    <p className="text-xs text-gray-500">{tree.stadtteil} • Soil moisture deeply critical</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-red-500">{tree.moisture}%</p>
                  <button className="text-xs font-bold text-blue-600 hover:text-blue-800 underline">Dispatch Ticket</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
