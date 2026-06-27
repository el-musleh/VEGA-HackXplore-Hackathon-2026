import { MapPin, Truck, CheckCircle2, Download, Navigation } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

// Haversine distance
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}

// Nearest Neighbor Route Optimizer
function optimizeRoute(treesList) {
  if (treesList.length === 0) return [];
  let unvisited = [...treesList];
  let current = unvisited.shift();
  let route = [current];

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;
    for (let i = 0; i < unvisited.length; i++) {
      const dist = getDistance(current.pos[0], current.pos[1], unvisited[i].pos[0], unvisited[i].pos[1]);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }
    current = unvisited[nearestIdx];
    route.push(current);
    unvisited.splice(nearestIdx, 1);
  }
  return route;
}

export default function EnterpriseRoutes() {
  const { trees } = useOutletContext();
  
  const criticalTrees = trees.filter(t => t.moisture < 20).slice(0, 5); 
  const manifestTrees = optimizeRoute(criticalTrees);

  return (
    <div className="min-h-full bg-gray-bg p-6 text-gray-800 pb-24">
      <div className="mb-6 mt-4">
        <p className="text-water-drop-blue font-bold text-xs tracking-widest uppercase mb-1">Routenplanung</p>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Route Optimizer</h1>
        <p className="text-gray-500 text-sm mt-2 leading-relaxed">
          Daily watering manifest. Trees with healthy moisture levels or those recently watered by citizens are automatically excluded.
        </p>
      </div>

      <div className="bg-white border-2 border-gray-100 rounded-3xl p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Truck className="text-gray-900 mr-2" size={20} />
            <h2 className="font-bold text-gray-900">Truck #4 - Downtown</h2>
          </div>
          <span className="bg-earthy-green/10 text-earthy-green font-black text-xs px-2 py-1 rounded-lg">
            Optimized
          </span>
        </div>
        
        <div className="space-y-4">
          {manifestTrees.map((tree, idx) => (
            <div key={tree.id} className="flex items-start">
              <div className="flex flex-col items-center mr-3">
                <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-500 font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </div>
                {idx !== manifestTrees.length - 1 && (
                  <div className="w-0.5 h-10 bg-gray-100 mt-1" />
                )}
              </div>
              <div className="flex-1 pb-1">
                <h3 className="font-bold text-sm text-gray-900">{tree.name} <span className="text-xs font-normal text-gray-400">#{tree.id}</span></h3>
                <p className="text-xs text-gray-500 mb-1">{tree.stadtteil}</p>
                <div className="flex items-center text-[10px] text-gray-400 mb-2 font-medium bg-gray-50 inline-flex px-2 py-1 rounded-md">
                  <Navigation size={10} className="mr-1 text-earthy-green" />
                  {tree.pos[0].toFixed(5)}, {tree.pos[1].toFixed(5)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-md">
                    {tree.moisture}% Moisture
                  </span>
                  <span className="text-[10px] font-bold text-water-drop-blue bg-blue-50 px-2 py-0.5 rounded-md">
                    Needs 40L
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-black text-gray-900">42</p>
          <p className="text-xs text-gray-500 font-medium">Stops Avoided</p>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm text-center">
          <p className="text-2xl font-black text-gray-900">18km</p>
          <p className="text-xs text-gray-500 font-medium">Fuel Saved</p>
        </div>
      </div>

      <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black flex items-center justify-center shadow-lg active:scale-95 transition-transform">
        <Download className="mr-2" size={20} />
        Export Route to Driver Tablet
      </button>

    </div>
  );
}
