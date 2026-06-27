import { Truck, Download, MapPin } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

// Haversine formula to calculate distance between two coordinates in kilometers
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}

// Nearest Neighbor Routing Algorithm
function optimizeRoute(treesList) {
  if (treesList.length === 0) return [];
  
  let unvisited = [...treesList];
  let currentTree = unvisited.shift(); // Start with the first tree
  let route = [currentTree];

  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;

    for (let i = 0; i < unvisited.length; i++) {
      const dist = getDistance(
        currentTree.pos[0], currentTree.pos[1],
        unvisited[i].pos[0], unvisited[i].pos[1]
      );
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
  
  // Filter critically dry trees, take a subset, and run the TSP routing algorithm
  const criticalTrees = trees.filter(t => t.moisture < 20).slice(0, 12);
  const manifestTrees = optimizeRoute(criticalTrees);

  return (
    <div className="space-y-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Dynamic Route Optimization</h1>
          <p className="text-gray-500 mt-1">Daily watering manifest. Trees with healthy moisture levels or those recently watered by citizens are automatically excluded.</p>
        </div>
        <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg hover:bg-gray-800 transition-colors">
          <Download className="mr-2" size={20} />
          Export to Driver Tablets
        </button>
      </header>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Stops Avoided</p>
          <p className="text-4xl font-black text-gray-900">142</p>
          <p className="text-sm text-earthy-green font-medium mt-2">Thanks to citizen watering</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Fuel Saved (Est)</p>
          <p className="text-4xl font-black text-gray-900">38 km</p>
          <p className="text-sm text-earthy-green font-medium mt-2">~€45.00 daily savings</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mb-1">Active Trucks</p>
          <p className="text-4xl font-black text-gray-900">4 / 12</p>
          <p className="text-sm text-gray-500 font-medium mt-2">Currently dispatched</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col h-[500px]">
        <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
          <div className="flex items-center">
            <Truck className="text-gray-900 mr-3" size={24} />
            <div>
              <h2 className="font-bold text-gray-900 text-lg">Truck #4 - Downtown Sector</h2>
              <p className="text-sm text-gray-500">Driver: Hans Müller • Optimized Route</p>
            </div>
          </div>
          <span className="bg-earthy-green/10 text-earthy-green font-black text-sm px-4 py-2 rounded-xl">
            12 Stops
          </span>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-400">
                <th className="pb-3 font-bold">Stop</th>
                <th className="pb-3 font-bold">Tree ID & Species</th>
                <th className="pb-3 font-bold">District</th>
                <th className="pb-3 font-bold">Current Moisture</th>
                <th className="pb-3 font-bold">Required Volume</th>
              </tr>
            </thead>
            <tbody>
              {manifestTrees.map((tree, idx) => (
                <tr key={tree.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 font-black text-gray-400">
                    {String(idx + 1).padStart(2, '0')}
                  </td>
                  <td className="py-4">
                    <p className="font-bold text-gray-900">{tree.name}</p>
                    <p className="text-xs text-gray-500">#{tree.id}</p>
                  </td>
                  <td className="py-4 font-medium text-gray-600">
                    <p className="text-sm">{tree.stadtteil}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5 flex items-center">
                      <MapPin size={10} className="mr-1" />
                      {tree.pos[0].toFixed(5)}, {tree.pos[1].toFixed(5)}
                    </p>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-lg">
                      {tree.moisture}%
                    </span>
                  </td>
                  <td className="py-4">
                    <span className="text-xs font-bold text-water-drop-blue bg-blue-50 px-3 py-1 rounded-lg">
                      40 Liters
                    </span>
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
