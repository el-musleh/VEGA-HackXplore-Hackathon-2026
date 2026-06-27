import { Flame, ThermometerSun, AlertTriangle, ArrowRight, Bell, Send } from 'lucide-react';

export default function AdminAlerts() {
  return (
    <div className="space-y-6">
      <header className="mb-8">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center">
          <Flame className="text-orange-500 mr-3" size={32} />
          Alerts & Engagement
        </h1>
        <p className="text-gray-500 mt-1">Predictive heatwave forecasting and citizen mobilization tools.</p>
      </header>

      <div className="grid grid-cols-2 gap-6">
        
        {/* Heatwave & Push Notification Builder */}
        <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-8 shadow-lg relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20" />
          
          <div className="flex items-center mb-6 relative z-10">
            <ThermometerSun className="text-white mr-3" size={32} />
            <h2 className="text-2xl font-black text-white uppercase tracking-wider">Heatwave Warning</h2>
          </div>
          
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6 border border-white/20 relative z-10 flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-white/70 uppercase font-bold tracking-widest">DWD (Deutscher Wetterdienst)</p>
              <span className="bg-red-500 text-white text-[10px] uppercase font-black px-2 py-1 rounded shadow-sm">Level 3 Alert</span>
            </div>
            
            <p className="text-base text-white font-medium leading-relaxed mb-4">
              Temperatures are forecast to hit <strong className="font-black text-white text-xl">35°C</strong> tomorrow. 
              Predictive models indicate 450+ trees in the Downtown and Nordstadt areas will drop below 15% moisture.
            </p>
            
            <div className="bg-black/20 rounded-xl p-4 mt-6">
              <p className="text-xs text-white/60 uppercase font-bold mb-2 flex items-center">
                <Bell size={12} className="mr-1" /> Draft Push Notification to Citizens
              </p>
              <textarea 
                className="w-full bg-white/10 text-white placeholder-white/40 rounded-lg p-3 text-sm border border-white/20 focus:outline-none focus:border-white/50 resize-none font-medium"
                rows={3}
                defaultValue="🚨 Heatwave Alert! The DWD predicts 35°C tomorrow. We are offering DOUBLE Eco-Points for watering any trees in the Nordstadt district today!"
              />
            </div>
          </div>
          
          <button className="w-full bg-white text-red-600 py-4 rounded-xl font-black text-base shadow-xl hover:bg-gray-50 transition-colors flex items-center justify-center relative z-10">
            <Send size={18} className="mr-2" />
            Blast Push Notification to 12,450 Citizens
          </button>
        </div>

        {/* Dispatch & Vulnerable Districts */}
        <div className="flex flex-col space-y-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-black text-gray-900">Vulnerable Districts</h2>
              <button className="text-sm font-bold text-water-drop-blue hover:underline">View Map</button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <h3 className="font-bold text-base text-gray-900 mb-1">Downtown</h3>
                  <p className="text-xs text-gray-500 font-medium">142 Trees at critical risk</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Citizen Coverage</p>
                    <p className="text-sm font-bold text-orange-500">22%</p>
                  </div>
                  <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100 shadow-sm">
                    <span className="text-red-600 font-black text-sm">High</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <h3 className="font-bold text-base text-gray-900 mb-1">North District</h3>
                  <p className="text-xs text-gray-500 font-medium">89 Trees at critical risk</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Citizen Coverage</p>
                    <p className="text-sm font-bold text-earthy-green">65%</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100 shadow-sm">
                    <span className="text-orange-500 font-black text-sm">Med</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div>
                  <h3 className="font-bold text-base text-gray-900 mb-1">Suburbs</h3>
                  <p className="text-xs text-gray-500 font-medium">12 Trees at critical risk</p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Citizen Coverage</p>
                    <p className="text-sm font-bold text-earthy-green">88%</p>
                  </div>
                  <div className="w-12 h-12 bg-earthy-green/10 rounded-full flex items-center justify-center border border-earthy-green/20 shadow-sm">
                    <span className="text-earthy-green font-black text-sm">Low</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 rounded-2xl p-6 flex-1 flex flex-col justify-center items-center text-center relative overflow-hidden">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-water-drop-blue/10 rounded-full blur-2xl" />
            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mb-4 shadow-inner border border-gray-700">
              <AlertTriangle className="text-water-drop-blue" size={24} />
            </div>
            <h3 className="font-black text-lg text-white mb-2">Automated Municipal Dispatch</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm">
              Automatically deploy city water trucks to High-Risk zones if Citizen Coverage drops below 30% for 48 hours.
            </p>
            <button className="bg-water-drop-blue text-white font-bold text-sm px-6 py-3 rounded-xl shadow-lg hover:bg-blue-500 transition-colors flex items-center">
              Configure Ruleset <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
