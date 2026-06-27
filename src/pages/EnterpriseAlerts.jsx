import { Flame, ThermometerSun, AlertTriangle, ArrowRight } from 'lucide-react';

export default function EnterpriseAlerts() {
  return (
    <div className="min-h-full bg-gray-bg p-6 text-gray-800 pb-24">
      <div className="mb-6 mt-4">
        <h1 className="text-3xl font-black tracking-tight text-gray-900 flex items-center">
          <Flame className="text-orange-500 mr-3" size={32} />
          Alerts
        </h1>
        <p className="text-gray-500 text-sm mt-1">Predictive heatwave & dryness forecasting.</p>
      </div>

      {/* Active Heatwave Alert */}
      <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <div className="flex items-center mb-4">
          <ThermometerSun className="text-white mr-2" size={24} />
          <h2 className="text-lg font-black text-white uppercase tracking-wider">Heatwave Incoming</h2>
        </div>
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-4 border border-white/20">
          <p className="text-xs text-white/70 uppercase font-bold mb-1">DWD (Deutscher Wetterdienst) Alert</p>
          <p className="text-sm text-white font-medium leading-relaxed">
            "Alert: The DWD predicts <strong className="font-black text-white">35°C</strong> tomorrow. Double Eco-Points for watering trees in the Nordstadt district today!"
          </p>
        </div>
        <button className="w-full bg-white text-red-600 py-3 rounded-xl font-black text-sm shadow-md active:scale-95 transition-transform flex items-center justify-center">
          Blast Push Notification to Citizens
          <ArrowRight size={16} className="ml-2" />
        </button>
      </div>

      <h2 className="text-lg font-black text-gray-900 mb-4">Vulnerable Districts</h2>
      <div className="space-y-3">
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Downtown</h3>
            <p className="text-[10px] text-gray-400 uppercase font-bold">142 Trees at risk</p>
          </div>
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center border border-red-100">
            <span className="text-red-500 font-black text-sm">High</span>
          </div>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">North District</h3>
            <p className="text-[10px] text-gray-400 uppercase font-bold">89 Trees at risk</p>
          </div>
          <div className="w-12 h-12 bg-orange-50 rounded-full flex items-center justify-center border border-orange-100">
            <span className="text-orange-500 font-black text-sm">Med</span>
          </div>
        </div>
        <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <h3 className="font-bold text-sm text-gray-900 mb-1">Suburbs</h3>
            <p className="text-[10px] text-gray-400 uppercase font-bold">12 Trees at risk</p>
          </div>
          <div className="w-12 h-12 bg-earthy-green/10 rounded-full flex items-center justify-center border border-earthy-green/20">
            <span className="text-earthy-green font-black text-sm">Low</span>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-white border-2 border-gray-100 shadow-sm rounded-3xl p-6 text-center">
        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="text-gray-400" size={20} />
        </div>
        <h3 className="font-bold text-sm text-gray-900 mb-2">Automated Dispatch</h3>
        <p className="text-xs text-gray-500 mb-4">Automatically send municipal water trucks to high-risk zones when citizen engagement drops.</p>
        <button className="text-water-drop-blue font-bold text-xs flex items-center justify-center w-full">
          Configure Dispatch Rules <ArrowRight size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
