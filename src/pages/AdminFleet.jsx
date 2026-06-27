import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Battery, Wifi, Settings2, Droplets, MapPin, Wrench, Search, Filter } from 'lucide-react';
import clsx from 'clsx';

export default function AdminFleet() {
  const { trees } = useOutletContext();
  const [filter, setFilter] = useState('all'); 
  
  const sensors = trees.slice(0, 100).map(t => ({
    ...t,
    battery: Math.floor(Math.random() * 100),
    isOnline: Math.random() > 0.1,
  }));

  const filteredSensors = sensors.filter(s => {
    if (filter === 'auto') return s.hasAutoValve;
    if (filter === 'offline') return !s.isOnline;
    return true;
  });

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Fleet & Sensor Management</h1>
        <p className="text-gray-500 mt-1">Manage deployed ESP32 units, battery life, and remote smart valves.</p>
      </header>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-2">
          <button 
            onClick={() => setFilter('all')}
            className={clsx("px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2", filter === 'all' ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-600 border-gray-200 hover:text-gray-900 hover:border-gray-300")}
          >
            All Sensors
          </button>
          <button 
            onClick={() => setFilter('auto')}
            className={clsx("px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 flex items-center", filter === 'auto' ? "bg-water-drop-blue text-white border-water-drop-blue" : "bg-white text-gray-600 border-gray-200 hover:text-gray-900 hover:border-gray-300")}
          >
            <Droplets size={16} className="mr-2" /> Auto-Valves
          </button>
          <button 
            onClick={() => setFilter('offline')}
            className={clsx("px-5 py-2.5 rounded-xl text-sm font-bold transition-all border-2 flex items-center", filter === 'offline' ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-600 border-gray-200 hover:text-gray-900 hover:border-gray-300")}
          >
            <Wifi size={16} className="mr-2" /> Offline / Alerts
          </button>
        </div>

        <div className="flex space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search ID or District..."
              className="pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-earthy-green/50 w-64 shadow-sm"
            />
          </div>
          <button className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 flex items-center shadow-sm font-bold text-sm transition-colors">
            <Filter size={18} className="mr-2" /> Filters
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[600px]">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Sensor ID & Location</th>
                <th className="py-4 px-6">Moisture</th>
                <th className="py-4 px-6">Battery</th>
                <th className="py-4 px-6">Signal (LoRaWAN)</th>
                <th className="py-4 px-6">Hardware Type</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSensors.map((sensor) => (
                <tr key={sensor.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="py-4 px-6">
                    <div className={clsx("w-3 h-3 rounded-full", sensor.isOnline ? "bg-earthy-green shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]")} />
                  </td>
                  <td className="py-4 px-6">
                    <p className="font-bold text-gray-900">{sensor.name} <span className="text-gray-400 font-medium text-xs ml-1">#{sensor.id}</span></p>
                    <p className="text-xs text-gray-500 flex items-center mt-0.5">
                      <MapPin size={10} className="mr-1" /> {sensor.stadtteil || 'Unknown District'}
                    </p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={clsx("text-sm font-black", sensor.moisture < 20 ? "text-red-600" : "text-gray-900")}>
                      {sensor.moisture}%
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Battery size={16} className={clsx(sensor.battery < 20 ? "text-red-500" : "text-gray-400")} />
                      <span className="text-sm font-bold text-gray-900">{sensor.battery}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <Wifi size={16} className={clsx(!sensor.isOnline ? "text-red-500" : "text-gray-400")} />
                      <span className="text-sm font-bold text-gray-900">{sensor.isOnline ? '-65 dBm' : 'Offline'}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                      {sensor.hasAutoValve ? 'Smart Valve Node' : 'Passive Node'}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="flex justify-end items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {!sensor.isOnline ? (
                        <button className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors flex items-center">
                          <Wrench size={12} className="mr-1.5" /> Maintenance Ticket
                        </button>
                      ) : sensor.hasAutoValve && sensor.moisture < 30 ? (
                        <button className="px-3 py-1.5 bg-water-drop-blue/10 text-water-drop-blue border border-water-drop-blue/20 rounded-lg text-xs font-bold hover:bg-water-drop-blue/20 transition-colors flex items-center">
                          <Droplets size={12} className="mr-1.5" /> Trigger Valve
                        </button>
                      ) : (
                        <button className="px-3 py-1.5 bg-white text-gray-600 border border-gray-200 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors flex items-center">
                          <Settings2 size={12} className="mr-1.5" /> Calibrate
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
