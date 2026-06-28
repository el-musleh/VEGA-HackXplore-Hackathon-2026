import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Server, Battery, AlertTriangle, Settings2, Wifi, Zap, RefreshCw } from 'lucide-react';

export default function AdminHardware() {
  const { trees } = useOutletContext();
  const [activeTab, setActiveTab] = useState('inventory'); // inventory, battery, calibration

  // Generate mock hardware data from the trees context
  const sensors = trees.map((t, idx) => ({
    id: t.id,
    species: t.name,
    mac: `00:1B:44:11:3A:${(idx % 99).toString().padStart(2, '0')}`,
    installed: new Date(2023, idx % 12, (idx % 28) + 1).toLocaleDateString(),
    battery: idx % 20 === 0 ? Math.floor(Math.random() * 10) + 2 : 100 - (idx % 40),
    isErratic: idx % 45 === 0, // Mock calibration error
    moisture: t.moisture
  }));

  const lowBattery = sensors.filter(s => s.battery < 15);
  const erratic = sensors.filter(s => s.isErratic);

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">IoT Hardware & Maintenance</h1>
          <p className="text-gray-500 mt-1">Manage the physical sensor fleet, monitor battery life, and calibrate thresholds.</p>
        </div>
        <button 
          onClick={() => alert("Dynamic Threshold Settings Opened. (Mock Action)")}
          className="bg-white border border-gray-200 text-gray-900 px-4 py-2 rounded-xl font-bold flex items-center shadow-sm hover:bg-gray-50 transition-colors"
        >
          <Settings2 className="mr-2" size={18} />
          Set Dynamic Thresholds
        </button>
      </header>

      <div className="grid grid-cols-3 gap-6 shrink-0">
        <div 
          onClick={() => setActiveTab('inventory')}
          className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${activeTab === 'inventory' ? 'border-gray-900 bg-white shadow-md' : 'border-transparent bg-white shadow-sm hover:border-gray-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
              <Server className="text-gray-600" size={20} />
            </div>
            <span className="text-xl font-black text-gray-900">{sensors.length}</span>
          </div>
          <p className="font-bold text-gray-900">Sensor Inventory</p>
          <p className="text-xs text-gray-500 mt-1">All deployed IoT probes</p>
        </div>

        <div 
          onClick={() => setActiveTab('battery')}
          className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${activeTab === 'battery' ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-transparent bg-white shadow-sm hover:border-orange-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Battery className="text-orange-500" size={20} />
            </div>
            <span className="text-xl font-black text-orange-600">{lowBattery.length}</span>
          </div>
          <p className="font-bold text-gray-900">Battery Warning</p>
          <p className="text-xs text-gray-500 mt-1">Sensors below 15%</p>
        </div>

        <div 
          onClick={() => setActiveTab('calibration')}
          className={`p-6 rounded-2xl cursor-pointer transition-all border-2 ${activeTab === 'calibration' ? 'border-red-500 bg-red-50 shadow-md' : 'border-transparent bg-white shadow-sm hover:border-red-200'}`}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={20} />
            </div>
            <span className="text-xl font-black text-red-600">{erratic.length}</span>
          </div>
          <p className="font-bold text-gray-900">Calibration Errors</p>
          <p className="text-xs text-gray-500 mt-1">Erratic data detected</p>
        </div>
      </div>

      <div className="flex-1 bg-white border border-gray-100 rounded-3xl shadow-xl flex flex-col overflow-hidden min-h-0">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between shrink-0">
          <h2 className="font-black text-gray-900 text-lg">
            {activeTab === 'inventory' && 'Full Deployment Roster'}
            {activeTab === 'battery' && 'Critical Battery Replacements Required'}
            {activeTab === 'calibration' && 'Suspicious Telemetry / Calibration Required'}
          </h2>
          <button className="text-sm font-bold text-gray-500 flex items-center hover:text-gray-900">
            <RefreshCw size={14} className="mr-2" /> Sync Firmware
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                <th className="pb-3 font-bold">Node ID</th>
                <th className="pb-3 font-bold">MAC Address</th>
                <th className="pb-3 font-bold">Tree Assigned</th>
                <th className="pb-3 font-bold">Install Date</th>
                <th className="pb-3 font-bold">Status</th>
                <th className="pb-3 font-bold text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {(activeTab === 'inventory' ? sensors : activeTab === 'battery' ? lowBattery : erratic).map((sensor) => (
                <tr key={sensor.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-4 font-black text-gray-500">#{sensor.id}</td>
                  <td className="py-4 font-mono text-sm text-gray-600">{sensor.mac}</td>
                  <td className="py-4 font-bold text-gray-900">{sensor.species}</td>
                  <td className="py-4 text-sm text-gray-500">{sensor.installed}</td>
                  <td className="py-4">
                    {activeTab === 'calibration' ? (
                      <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full w-max">
                        <AlertTriangle size={12} className="mr-1" /> Flatlined at 100%
                      </span>
                    ) : activeTab === 'battery' || sensor.battery < 15 ? (
                      <span className="flex items-center text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded-full w-max">
                        <Zap size={12} className="mr-1" /> {sensor.battery}% Left
                      </span>
                    ) : (
                      <span className="flex items-center text-xs font-bold text-earthy-green bg-earthy-green/10 px-2 py-1 rounded-full w-max">
                        <Wifi size={12} className="mr-1" /> Online
                      </span>
                    )}
                  </td>
                  <td className="py-4 text-right">
                    <button className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
                      {activeTab === 'calibration' ? 'Recalibrate' : 'Dispatch Ticket'}
                    </button>
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
