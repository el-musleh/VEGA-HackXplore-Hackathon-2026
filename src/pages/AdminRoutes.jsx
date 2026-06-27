import { useState } from 'react';
import { Truck, Download, MapPin, Search, CheckCircle, Navigation } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import DeckGL from '@deck.gl/react';
import { PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json';

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}

function optimizeRoute(treesList) {
  if (treesList.length === 0) return [];
  let unvisited = [...treesList];
  let currentTree = unvisited.shift(); 
  let route = [currentTree];
  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;
    for (let i = 0; i < unvisited.length; i++) {
      const dist = getDistance(currentTree.pos[0], currentTree.pos[1], unvisited[i].pos[0], unvisited[i].pos[1]);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }
    currentTree = unvisited[nearestIdx];
    route.push(currentTree);
    unvisited.splice(nearestIdx, 1);
  }
  return route;
}

export default function AdminRoutes() {
  const { trees } = useOutletContext();
  const [activeDriver, setActiveDriver] = useState(4); // Driver #4
  
  // Calculate critical route
  const criticalTrees = trees.filter(t => t.moisture < 20).slice(0, 12);
  const manifestTrees = optimizeRoute(criticalTrees);

  const drivers = [
    { id: 1, name: "Markus Berg", status: "Available", vehicle: "Watering Truck" },
    { id: 2, name: "Anna Schmidt", status: "On Route", vehicle: "Maintenance Van", progress: 65 },
    { id: 4, name: "Hans Müller", status: "Standby", vehicle: "Heavy Tanker" },
    { id: 5, name: "Klaus Weber", status: "Off Duty", vehicle: "Watering Truck" }
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <header className="mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Fleet & Dispatch</h1>
          <p className="text-gray-500 mt-1">Assign dynamically generated routes and track city drivers in real-time.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl font-bold flex items-center shadow-sm hover:bg-gray-50 transition-colors">
            Manage Access
          </button>
          <button 
            onClick={() => {
              localStorage.setItem('activeDriverRoute', JSON.stringify(manifestTrees));
              alert('Route successfully dispatched to Hans Müller (Truck #4)! Open the Driver App to see it.');
            }}
            className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold flex items-center shadow-lg hover:bg-gray-800 transition-colors active:scale-95"
          >
            <Download className="mr-2" size={18} />
            Dispatch Ticket
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Drivers & Drag-and-Drop UI */}
        <div className="col-span-4 bg-white border border-gray-200 rounded-3xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50">
            <h2 className="font-black text-gray-900">Active Workforce</h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search drivers..." className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-earthy-green" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {drivers.map(driver => (
              <div 
                key={driver.id}
                onClick={() => setActiveDriver(driver.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${activeDriver === driver.id ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-transparent hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600 mr-3">
                      {driver.name.split(' ').map(n=>n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">{driver.name}</h3>
                      <p className="text-xs text-gray-500 font-medium">#{driver.id} • {driver.vehicle}</p>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${
                    driver.status === 'Available' || driver.status === 'Standby' ? 'bg-earthy-green/10 text-earthy-green' : 
                    driver.status === 'On Route' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {driver.status}
                  </span>
                </div>
                
                {/* Mock Drag & Drop Dropzone */}
                {activeDriver === driver.id && (
                  <div className="mt-4 border-2 border-dashed border-gray-300 rounded-xl p-4 text-center bg-white transition-colors hover:border-gray-400 hover:bg-gray-50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Assigned Route</p>
                    {driver.id === 4 ? (
                      <div className="bg-gray-900 text-white p-3 rounded-lg flex items-center justify-between shadow-md cursor-grab">
                        <div className="flex items-center text-left">
                          <MapPin size={16} className="text-red-500 mr-2" />
                          <div>
                            <p className="font-bold text-sm">Downtown Critical Zone</p>
                            <p className="text-[10px] text-gray-400">12 Stops • 480L Water</p>
                          </div>
                        </div>
                        <CheckCircle size={16} className="text-earthy-green" />
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 py-3 font-medium">Drag a generated route here</p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Route Details & Live Map */}
        <div className="col-span-8 flex flex-col space-y-6 min-h-0">
          
          {/* Top: Route Details */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-sm p-6 grid grid-cols-4 gap-4 shrink-0">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Generated Route</p>
              <h2 className="text-xl font-black text-gray-900 truncate">Downtown Critical Zone</h2>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stops</p>
              <p className="text-xl font-black text-gray-900">{manifestTrees.length}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Est. Duration</p>
              <p className="text-xl font-black text-gray-900">45 mins</p>
            </div>
            <div className="bg-earthy-green/10 rounded-xl p-3 flex items-center justify-center flex-col border border-earthy-green/20">
              <p className="text-[10px] font-bold text-earthy-green uppercase tracking-widest">Efficiency</p>
              <p className="text-lg font-black text-earthy-green leading-none mt-1">94% Opt</p>
            </div>
          </div>

          {/* Bottom: Live Mini Map */}
          <div className="flex-1 bg-gray-900 rounded-3xl shadow-xl overflow-hidden relative border border-gray-800">
            {manifestTrees.length > 0 && (
              <DeckGL
                initialViewState={{
                  longitude: manifestTrees[0].pos[1],
                  latitude: manifestTrees[0].pos[0],
                  zoom: 14, pitch: 45, bearing: 0
                }}
                controller={true}
                layers={[
                  new PathLayer({
                    id: 'route-path',
                    data: [{
                      path: manifestTrees.map(t => [t.pos[1], t.pos[0]]),
                      color: [239, 68, 68]
                    }],
                    getPath: d => d.path,
                    getColor: d => d.color,
                    getWidth: 5,
                    widthMinPixels: 4,
                  }),
                  new ScatterplotLayer({
                    id: 'route-stops',
                    data: manifestTrees,
                    getPosition: d => [d.pos[1], d.pos[0]],
                    getFillColor: [255, 255, 255, 255],
                    getRadius: 15,
                    radiusMinPixels: 4,
                    lineWidthMinPixels: 2,
                    getLineColor: [0, 0, 0]
                  }),
                  // Live Driver Location Marker (Mock)
                  new ScatterplotLayer({
                    id: 'driver-location',
                    data: [{ pos: manifestTrees[0].pos }],
                    getPosition: d => [d.pos[1], d.pos[0]],
                    getFillColor: [59, 130, 246, 255], // Blue
                    getRadius: 30,
                    radiusMinPixels: 8,
                    getLineColor: [255, 255, 255],
                    lineWidthMinPixels: 3,
                  })
                ]}
              >
                <Map mapLib={maplibregl} mapStyle={MAP_STYLE} />
              </DeckGL>
            )}
            
            <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2 shadow-[0_0_10px_#3b82f6] animate-pulse"></div>
              <span className="text-xs font-bold text-white uppercase tracking-widest">Live Tracking Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
