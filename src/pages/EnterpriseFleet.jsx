import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { RadioReceiver, Battery, Wifi, Settings2, Droplets, MapPin } from 'lucide-react';
import clsx from 'clsx';

export default function EnterpriseFleet() {
  const { trees } = useOutletContext();
  const [filter, setFilter] = useState('all'); // all, auto, offline
  
  const sensors = trees.slice(0, 50).map(t => ({
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
    <div className="min-h-full bg-gray-bg p-6 text-gray-800 pb-24">
      <div className="mb-6 mt-4">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Sensor Fleet</h1>
        <p className="text-gray-500 text-sm mt-1">Manage deployed ESP32 units.</p>
      </div>

      <div className="flex space-x-2 mb-6 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
        <button 
          onClick={() => setFilter('all')}
          className={clsx("px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-colors border-2", filter === 'all' ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-500 border-gray-100 hover:text-gray-800")}
        >
          All Sensors
        </button>
        <button 
          onClick={() => setFilter('auto')}
          className={clsx("px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-colors border-2 flex items-center", filter === 'auto' ? "bg-water-drop-blue text-white border-water-drop-blue" : "bg-white text-gray-500 border-gray-100 hover:text-gray-800")}
        >
          <Droplets size={12} className="mr-1" /> Auto-Valves
        </button>
        <button 
          onClick={() => setFilter('offline')}
          className={clsx("px-4 py-2 rounded-full text-xs font-bold shrink-0 transition-colors border-2 flex items-center", filter === 'offline' ? "bg-red-500 text-white border-red-500" : "bg-white text-gray-500 border-gray-100 hover:text-gray-800")}
        >
          <Wifi size={12} className="mr-1" /> Offline
        </button>
      </div>

      <div className="space-y-4">
        {filteredSensors.map((sensor) => (
          <div key={sensor.id} className="bg-white border-2 border-gray-100 rounded-3xl p-5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center">
                <div className={clsx("w-3 h-3 rounded-full mr-3", sensor.isOnline ? "bg-earthy-green shadow-[0_0_10px_rgba(34,197,94,0.3)]" : "bg-red-500")} />
                <div>
                  <h3 className="font-bold text-sm text-gray-900">{sensor.name} #{sensor.id}</h3>
                  <p className="text-[10px] text-gray-500 font-medium flex items-center mt-1">
                    <MapPin size={10} className="mr-1" /> {sensor.stadtteil || 'Unknown District'}
                  </p>
                </div>
              </div>
              <button className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-800 transition-colors">
                <Settings2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 bg-gray-50 rounded-2xl p-3">
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Moisture</p>
                <p className={clsx("text-sm font-black", sensor.moisture < 20 ? "text-red-500" : "text-gray-900")}>{sensor.moisture}%</p>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Battery</p>
                <div className="flex items-center">
                  <Battery size={12} className={clsx("mr-1", sensor.battery < 20 ? "text-red-500" : "text-gray-400")} />
                  <p className="text-sm font-black text-gray-900">{sensor.battery}%</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Signal</p>
                <div className="flex items-center">
                  <Wifi size={12} className={clsx("mr-1", !sensor.isOnline ? "text-red-500" : "text-gray-400")} />
                  <p className="text-sm font-black text-gray-900">{sensor.isOnline ? '-65dBm' : 'Offline'}</p>
                </div>
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Soil</p>
                <p className="text-xs font-bold text-gray-600 truncate">Sandy</p>
              </div>
            </div>

            {sensor.hasAutoValve && sensor.moisture < 30 && sensor.isOnline && (
              <button className="w-full mt-4 py-3 bg-water-drop-blue/10 text-water-drop-blue border-2 border-water-drop-blue/20 rounded-xl text-xs font-bold flex items-center justify-center hover:bg-water-drop-blue/20 transition-colors shadow-sm">
                <Droplets size={14} className="mr-2" /> Remotely Open Valve (5L)
              </button>
            )}

            {!sensor.isOnline && (
              <div className="mt-4 flex space-x-2">
                <button className="flex-1 py-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-bold flex items-center justify-center hover:bg-red-100 transition-colors">
                  Generate Maintenance Ticket
                </button>
              </div>
            )}
            
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase">Alert Threshold</p>
                <p className="text-xs font-bold text-gray-900">&lt; 20% Moisture</p>
              </div>
              <button className="text-water-drop-blue font-bold text-[10px] uppercase bg-water-drop-blue/10 px-3 py-1.5 rounded-lg">
                Calibrate Soil Type
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
