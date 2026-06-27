import { useState, useEffect } from 'react';
import { Truck, Droplet, Download, MapPin, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function EnterpriseDashboard() {
  const navigate = useNavigate();
  const [routeStops, setRouteStops] = useState([]);
  const [completedStops, setCompletedStops] = useState([]);
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    const savedRoute = localStorage.getItem('activeDriverRoute');
    if (savedRoute) setRouteStops(JSON.parse(savedRoute));

    const savedCompleted = localStorage.getItem('driverCompletedStops');
    if (savedCompleted) setCompletedStops(JSON.parse(savedCompleted));
  }, []);

  const totalWaterNeeded = routeStops.length * 40; // Approx 40L per tree
  const tankCapacity = 2000;
  const currentWater = Math.max(0, tankCapacity - (completedStops.length * 40));
  const tankPercentage = Math.round((currentWater / tankCapacity) * 100);

  const handleDownload = () => {
    setIsDownloaded(true);
    setTimeout(() => {
      alert("Offline maps and route manifest downloaded successfully!");
    }, 500);
  };

  return (
    <div className="min-h-full bg-gray-bg p-6 flex flex-col space-y-6">
      
      {/* Header Profile */}
      <header className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center font-bold text-white shadow-lg border-2 border-white text-lg">
            HM
          </div>
          <div className="ml-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Shift Started</p>
            <h1 className="text-xl font-black text-gray-900 leading-tight">Hans Müller</h1>
          </div>
        </div>
        <div className="bg-white p-2 rounded-xl shadow-sm">
          <Truck size={24} className="text-gray-900" />
        </div>
      </header>

      {/* Water Tank Status */}
      <div className="bg-gray-900 rounded-3xl p-6 shadow-xl relative overflow-hidden border border-gray-800">
        <div className="absolute -right-4 -bottom-4 opacity-10">
          <Droplet size={150} className="text-white" />
        </div>
        
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center mb-1">
              <Droplet size={16} className="text-blue-400 mr-2" />
              <h2 className="text-sm font-bold text-blue-100 uppercase tracking-widest">Water Tank Volume</h2>
            </div>
            <div className="flex items-end mt-2">
              <span className="text-5xl font-black text-white leading-none">{currentWater}</span>
              <span className="text-lg font-bold text-gray-400 ml-1 mb-1">/ {tankCapacity} L</span>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
              <span>{tankPercentage}% Remaining</span>
              <span>{totalWaterNeeded}L needed for route</span>
            </div>
            <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${tankPercentage < 20 ? 'bg-red-500' : 'bg-blue-500'}`}
                style={{ width: `${tankPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Manifest */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black text-gray-900">Today's Route</h2>
          <span className="text-xs font-bold bg-earthy-green/10 text-earthy-green px-3 py-1 rounded-lg">
            {routeStops.length} Stops
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center mr-4 shrink-0 border border-gray-100">
              <MapPin size={18} className="text-gray-600" />
            </div>
            <div>
              <p className="font-bold text-gray-900">Downtown Critical Zone</p>
              <p className="text-sm text-gray-500 mt-0.5">High-priority drought response. Estimated 45 mins driving time.</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100">
          <button 
            onClick={isDownloaded ? () => navigate('/enterprise/routes') : handleDownload}
            className={`w-full py-4 rounded-2xl font-black flex items-center justify-center transition-all ${
              isDownloaded 
                ? 'bg-earthy-green text-white shadow-lg shadow-earthy-green/30' 
                : 'bg-gray-900 text-white shadow-lg shadow-gray-900/30'
            }`}
          >
            {isDownloaded ? (
              <><CheckCircle size={20} className="mr-2" /> Start Navigation</>
            ) : (
              <><Download size={20} className="mr-2" /> Download Maps for Offline</>
            )}
          </button>
          {!isDownloaded && (
            <p className="text-center text-xs text-gray-400 font-bold mt-4 uppercase tracking-widest">
              Required before starting shift
            </p>
          )}
        </div>
      </div>

    </div>
  );
}
