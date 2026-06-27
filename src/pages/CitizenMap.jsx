import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Info, Droplet, MapPin, Wifi, Navigation, Camera } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import clsx from 'clsx';

// Custom icons
const greenIcon = new L.DivIcon({
  html: `<div class="w-8 h-8 bg-earthy-green rounded-full flex items-center justify-center border-2 border-white shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/></svg></div>`,
  className: 'custom-leaflet-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const yellowIcon = new L.DivIcon({
  html: `<div class="w-8 h-8 bg-warning-amber rounded-full flex items-center justify-center border-2 border-white shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg></div>`,
  className: 'custom-leaflet-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const redIcon = new L.DivIcon({
  html: `<div class="w-8 h-8 bg-warning-red rounded-full flex items-center justify-center border-2 border-white shadow-md animate-pulse"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg></div>`,
  className: 'custom-leaflet-icon',
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const getIconForMoisture = (moisture) => {
  if (moisture < 15) return redIcon;
  if (moisture < 30) return yellowIcon;
  return greenIcon;
};

// Component to handle map interactions
function MapInteractions({ center }) {
  const map = useMap();
  map.setView(center, 16);
  return null;
}

export default function CitizenMap() {
  const { trees, handleScan, handleRemoteWater } = useOutletContext();
  const [mapCenter, setMapCenter] = useState(trees.length > 0 ? trees[0].pos : [49.0069, 8.4037]);
  const [remoteWatering, setRemoteWatering] = useState(null);

  const triggerRemoteWater = (id) => {
    setRemoteWatering(id);
    handleRemoteWater(id);
    setTimeout(() => {
      setRemoteWatering(null);
    }, 2500);
  };

  const needyTrees = trees.filter(t => t.moisture < 30).sort((a, b) => a.moisture - b.moisture);

  const focusTree = (tree) => {
    setMapCenter(tree.pos);
  };

  return (
    <div className="flex flex-col h-full bg-gray-bg relative">
      {/* Map Container */}
      <div className="flex-1 w-full relative z-0">
        <MapContainer center={mapCenter} zoom={16} zoomControl={false} style={{ width: '100%', height: '100%' }}>
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          <MapInteractions center={mapCenter} />
          {trees.map((tree) => (
            <Marker 
              key={tree.id} 
              position={tree.pos} 
              icon={getIconForMoisture(tree.moisture)}
            >
              <Popup className="rounded-xl overflow-hidden min-w-[240px]">
                <div className="text-left p-1">
                  <div className="flex items-center mb-1">
                    <h3 className="font-bold text-gray-800 text-base leading-tight">{tree.name}</h3>
                    {tree.hasAutoValve && <Wifi size={14} className="ml-2 text-water-drop-blue shrink-0" title="Smart Valve Enabled"/>}
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3 mb-3 mt-2 border border-gray-100 space-y-2">
                    <p className="text-xs text-gray-600 flex items-center">
                      <Info size={12} className="mr-2 text-gray-400 shrink-0"/> 
                      <span>Type: <strong>{tree.type}</strong></span>
                    </p>
                    <p className="text-xs text-gray-600 flex items-center">
                      <Droplet size={12} className={clsx("mr-2 shrink-0", tree.moisture < 30 ? "text-warning-red" : "text-water-drop-blue")}/> 
                      <span>Moisture: <strong className={tree.moisture < 30 ? "text-warning-red" : ""}>{tree.moisture}%</strong></span>
                    </p>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={clsx("h-full", tree.moisture < 15 ? "bg-warning-red" : tree.moisture < 30 ? "bg-warning-amber" : "bg-earthy-green")} 
                        style={{ width: `${tree.moisture}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-600 flex items-center">
                      <Droplet size={12} className="mr-2 text-water-drop-blue shrink-0"/> 
                      <span>Needs: <strong>{tree.waterRequired}L Water</strong></span>
                    </p>
                    <p className={clsx("text-xs flex items-center", tree.sourceNearby ? "text-earthy-green" : "text-warning-amber")}>
                      <MapPin size={12} className="mr-2 shrink-0"/> 
                      <span>{tree.sourceNearby ? "Tap nearby" : `Bring ${tree.waterRequired}L with you`}</span>
                    </p>
                  </div>

                  <p className="text-[10px] text-gray-500 italic mb-3 bg-water-drop-blue/5 p-2 rounded-lg">
                    "{tree.fact}"
                  </p>

                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${tree.pos[0]},${tree.pos[1]}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center py-2 bg-gray-100 text-gray-700 rounded-xl text-xs font-bold mb-2 hover:bg-gray-200 transition-colors"
                  >
                    <Navigation size={14} className="mr-1.5" /> Navigate Here
                  </a>

                  {tree.moisture < 30 && (
                    tree.hasAutoValve ? (
                      <button 
                        onClick={() => triggerRemoteWater(tree.id)}
                        className="bg-water-drop-blue text-white text-xs px-3 py-2.5 rounded-xl font-bold w-full shadow-sm hover:bg-water-drop-blue-dark transition-colors flex items-center justify-center"
                      >
                        {remoteWatering === tree.id ? (
                          <span className="animate-pulse">Opening Valve...</span>
                        ) : (
                          <>Open Remote Valve (2m)</>
                        )}
                      </button>
                    ) : (
                      <button 
                        onClick={() => handleScan(tree.id)}
                        className="bg-gray-800 text-white text-xs px-3 py-2.5 rounded-xl font-bold w-full shadow-sm hover:bg-gray-900 transition-colors flex items-center justify-center"
                      >
                        <Camera size={14} className="mr-1.5"/> I Brought Water (Scan)
                      </button>
                    )
                  )}
                  {tree.moisture >= 30 && (
                    <div className="text-center text-xs font-bold text-earthy-green bg-earthy-green/10 py-2 rounded-xl">
                      Perfectly Hydrated
                    </div>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Near Me Quick List (Swipe Up / Horizontal Scroll) */}
      {needyTrees.length > 0 && (
        <div className="absolute bottom-4 left-0 right-0 z-[400] pointer-events-none">
          <div className="px-4 mb-2 flex justify-between items-center pointer-events-auto">
            <h3 className="text-sm font-black text-gray-800 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full shadow-sm">
              Near Me (Urgent)
            </h3>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-4 px-4 no-scrollbar pointer-events-auto snap-x">
            {needyTrees.map(tree => (
              <button 
                key={tree.id}
                onClick={() => focusTree(tree)}
                className="bg-white rounded-2xl p-3 shadow-lg border-2 border-gray-100 flex-shrink-0 w-48 flex items-center snap-center active:scale-95 transition-transform"
              >
                <div className={clsx(
                  "w-10 h-10 rounded-full flex items-center justify-center mr-3 shrink-0",
                  tree.moisture < 15 ? "bg-warning-red/10 text-warning-red" : "bg-warning-amber/10 text-warning-amber"
                )}>
                  <Droplet size={20} className={tree.moisture < 15 ? "fill-warning-red/20" : "fill-warning-amber/20"} />
                </div>
                <div className="text-left flex-1 overflow-hidden">
                  <h4 className="font-bold text-gray-800 text-xs truncate">{tree.name}</h4>
                  <p className={clsx(
                    "text-[10px] font-bold",
                    tree.moisture < 15 ? "text-warning-red" : "text-warning-amber"
                  )}>
                    {tree.moisture}% Moisture
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
