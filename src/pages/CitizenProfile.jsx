import { useOutletContext } from 'react-router-dom';
import { Droplet, Wind, ShieldCheck, Sun, Star, TreePine, Thermometer } from 'lucide-react';

export default function CitizenProfile() {
  const { ecoPoints } = useOutletContext();
  
  // Mock impact data based on points
  const litersDonated = Math.floor(ecoPoints / 2.5); // Metric conversion
  const co2Offset = (litersDonated * 0.15).toFixed(1); 
  const coolingEffect = (litersDonated * 0.02).toFixed(1); // Estimated cooling capacity maintained
  const treesHelped = Math.floor(litersDonated / 20); // Number of thirsty trees helped

  const badges = [
    { icon: ShieldCheck, name: "Mighty Oak", desc: "Top 10% of waterers", color: "text-amber-600", bg: "bg-amber-100" },
    { icon: Sun, name: "Heatwave Hero", desc: "Watered during +35°C", color: "text-red-500", bg: "bg-red-100" },
    { icon: Star, name: "Early Bird", desc: "Watered before 8 AM", color: "text-blue-500", bg: "bg-blue-100" }
  ];

  return (
    <div className="min-h-full bg-gray-bg flex flex-col pb-8">
      
      {/* Header Profile */}
      <header className="bg-white p-6 rounded-b-[40px] shadow-sm border-b border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Alex's Impact</h1>
            <p className="text-gray-500 font-medium mt-1">Level 42: Mighty Oak</p>
          </div>
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center font-black text-white text-xl shadow-lg">
            AL
          </div>
        </div>

        <div className="bg-earthy-green/10 p-5 rounded-3xl border border-earthy-green/20">
          <p className="text-xs font-bold text-earthy-green uppercase tracking-widest mb-1">Total Points</p>
          <p className="text-4xl font-black text-earthy-green">{ecoPoints.toLocaleString()}</p>
        </div>
      </header>

      <div className="px-6 space-y-8">
        
        {/* Real-World Impact */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Real-World Impact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <Droplet size={24} className="text-blue-500 mb-3" />
              <p className="text-3xl font-black text-gray-900">{litersDonated}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Liters Donated</p>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <Wind size={24} className="text-teal-500 mb-3" />
              <p className="text-3xl font-black text-gray-900">{co2Offset}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Kg CO2 Offset</p>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <Thermometer size={24} className="text-orange-500 mb-3" />
              <p className="text-3xl font-black text-gray-900">-{coolingEffect}°C</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Cooling Effect</p>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <TreePine size={24} className="text-earthy-green mb-3" />
              <p className="text-3xl font-black text-gray-900">{treesHelped}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Trees Helped</p>
            </div>
          </div>
        </div>

        {/* Badges Collection */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Badge Collection</h2>
          <div className="space-y-3">
            {badges.map((badge, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${badge.bg} ${badge.color}`}>
                  <badge.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{badge.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Adopt-a-Tree */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Adopted Trees</h2>
            <span className="text-xs font-bold text-earthy-green bg-earthy-green/10 px-2 py-1 rounded-lg">1 Active</span>
          </div>
          
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-start relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <TreePine size={120} className="text-gray-900" />
            </div>
            
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4 shrink-0 relative z-10">
              <TreePine size={24} className="text-gray-400" />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-gray-900">Maple (#842)</h3>
              <p className="text-xs text-gray-500 mt-0.5">Kaiserstraße 12</p>
              
              <div className="mt-4 flex items-center">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mr-3">
                  <div className="h-full bg-earthy-green rounded-full w-[85%]" />
                </div>
                <span className="text-[10px] font-bold text-gray-400">85% Health</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
