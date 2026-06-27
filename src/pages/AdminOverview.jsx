import { Droplet, Users, TrendingUp, AlertTriangle } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function AdminOverview() {
  const { trees } = useOutletContext();
  
  const totalTrees = trees.length;
  const criticalTrees = trees.filter(t => t.moisture < 15).length;
  const avgMoisture = Math.round(trees.reduce((acc, t) => acc + t.moisture, 0) / totalTrees);

  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Baumkataster Dashboard</h1>
        <p className="text-gray-500 mt-1">Real-time overview of city-wide sensor deployments and citizen engagement.</p>
      </header>

      {/* Top Stats Row */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-earthy-green/10 rounded-xl flex items-center justify-center">
              <Droplet className="text-earthy-green" size={20} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{totalTrees}</p>
          <p className="text-sm text-gray-500 font-medium mt-1">Connected Sensors</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
              <AlertTriangle className="text-red-500" size={20} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Alerts</span>
          </div>
          <p className="text-3xl font-black text-red-600">{criticalTrees}</p>
          <p className="text-sm text-gray-500 font-medium mt-1">Critical Drought Alerts</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-water-drop-blue/10 rounded-xl flex items-center justify-center">
              <Users className="text-water-drop-blue" size={20} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Wk</span>
          </div>
          <p className="text-3xl font-black text-gray-900">4,250L</p>
          <p className="text-sm text-gray-500 font-medium mt-1">Poured by Citizens</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
              <TrendingUp className="text-purple-500" size={20} />
            </div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Avg</span>
          </div>
          <p className="text-3xl font-black text-gray-900">{avgMoisture}%</p>
          <p className="text-sm text-gray-500 font-medium mt-1">City Moisture Index</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Species Analytics */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-black text-gray-900 mb-6">Species Analytics</h2>
          <div className="space-y-6 flex-1">
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-700">Linden (Tilia)</span>
                <span className="text-red-500">15% Avg Moisture</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 w-[15%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-700">Oak (Quercus)</span>
                <span className="text-earthy-green">35% Avg Moisture</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-earthy-green w-[35%]" />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-gray-700">Maple (Acer)</span>
                <span className="text-orange-500">22% Avg Moisture</span>
              </div>
              <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-orange-400 w-[22%]" />
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              Linden trees are showing critical distress city-wide. Recommendation: Shift future planting strategies towards drought-resistant Oak varieties.
            </p>
          </div>
        </div>

        {/* Financial ROI */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-black text-gray-900 mb-6">Financial ROI vs Citizen Engagement</h2>
          
          <div className="space-y-8 flex-1">
            <div>
              <div className="flex justify-between text-base mb-2">
                <span className="text-gray-500 font-medium">Watering by Citizens</span>
                <span className="text-gray-900 font-black">15,000 L</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-earthy-green w-[75%]" />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-base mb-2">
                <span className="text-gray-500 font-medium">Watering by City Trucks</span>
                <span className="text-gray-900 font-black">5,000 L</span>
              </div>
              <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-water-drop-blue w-[25%]" />
              </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500 leading-relaxed font-medium max-w-sm">
                Citizens poured 15,000 Liters this week, offsetting truck dispatches.
              </p>
              <div className="text-right">
                <p className="text-xs text-earthy-green font-bold uppercase tracking-widest mb-1">Savings</p>
                <p className="text-2xl font-black text-gray-900">€2,400</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
