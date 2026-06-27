import { Droplet, AlertTriangle, Users, TrendingUp, ChevronRight } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function EnterpriseDashboard() {
  const { trees } = useOutletContext();
  
  const totalTrees = trees.length;
  const criticalTrees = trees.filter(t => t.moisture < 15).length;
  const healthyTrees = trees.filter(t => t.moisture >= 30).length;
  const avgMoisture = Math.round(trees.reduce((acc, t) => acc + t.moisture, 0) / totalTrees);

  return (
    <div className="min-h-full bg-gray-bg p-6 text-gray-800 pb-24">
      <div className="mb-8 mt-4">
        <p className="text-earthy-green font-bold text-xs tracking-widest uppercase mb-1">Baumkataster</p>
        <h1 className="text-3xl font-black tracking-tight text-gray-900">City Analytics</h1>
      </div>

      {/* Critical Alert Card */}
      {criticalTrees > 0 && (
        <div className="bg-gradient-to-r from-red-500/20 to-red-900/40 border border-red-500/30 rounded-3xl p-5 mb-6 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <AlertTriangle size={64} />
          </div>
          <div className="flex items-start">
            <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center mr-4 shrink-0">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <div>
              <h3 className="text-red-600 font-bold text-sm uppercase tracking-wider mb-1">Critical Dryness</h3>
              <p className="text-3xl font-black text-red-600">{criticalTrees}</p>
              <p className="text-xs text-red-700/80 mt-1 font-medium">Trees require immediate dispatch today.</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-water-drop-blue/10 rounded-xl flex items-center justify-center">
              <Droplet className="text-water-drop-blue" size={16} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active</span>
          </div>
          <p className="text-2xl font-black text-gray-900">{totalTrees}</p>
          <p className="text-[10px] text-gray-500 font-medium mt-1">Connected Sensors</p>
        </div>
        
        <div className="bg-white border-2 border-gray-100 rounded-3xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="w-8 h-8 bg-earthy-green/10 rounded-xl flex items-center justify-center">
              <Users className="text-earthy-green" size={16} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wk</span>
          </div>
          <p className="text-2xl font-black text-gray-900">4,250L</p>
          <p className="text-[10px] text-gray-500 font-medium mt-1">Poured by Citizens</p>
        </div>
      </div>

      {/* Species Analytics */}
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm mb-6">
        <h2 className="text-lg font-black text-gray-900 mb-4">Species Analytics</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-gray-700">Linden (Tilia)</span>
              <span className="text-red-500">15% Avg Moisture</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 w-[15%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-gray-700">Oak (Quercus)</span>
              <span className="text-earthy-green">35% Avg Moisture</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-earthy-green w-[35%]" />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-xs font-bold mb-1">
              <span className="text-gray-700">Maple (Acer)</span>
              <span className="text-orange-500">22% Avg Moisture</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-400 w-[22%]" />
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-4 leading-relaxed">
          Linden trees are showing critical distress city-wide. Recommendation: Shift future planting strategies towards drought-resistant Oak varieties.
        </p>
      </div>

      {/* Financial ROI */}
      <div className="bg-white border-2 border-gray-100 rounded-3xl p-6 shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-black text-gray-900">Financial Impact</h2>
          <TrendingUp className="text-earthy-green" size={20} />
        </div>
        
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 font-medium">Watering by Citizens</span>
              <span className="text-gray-900 font-bold">15,000 L</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-earthy-green w-[75%]" />
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-500 font-medium">Watering by City Trucks</span>
              <span className="text-gray-900 font-bold">5,000 L</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-water-drop-blue w-[25%]" />
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
          <p className="text-xs text-gray-500 leading-relaxed font-medium">
            Citizens poured 15,000 Liters this week, saving the city <strong className="text-gray-900">€2,400</strong> in labor and fuel costs.
          </p>
        </div>
      </div>

    </div>
  );
}
