import { useNavigate } from 'react-router-dom';
import { Droplet, Map, Sprout, Briefcase } from 'lucide-react';

export default function Gateway() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen items-center justify-center p-6 bg-gray-50">
      {/* Logo Area */}
      <div className="flex flex-col items-center mb-16 animate-fade-in-down">
        <div className="w-32 h-32 bg-gradient-to-tr from-water-drop-blue to-earthy-green rounded-[40px] flex items-center justify-center mb-6 shadow-xl text-white transform rotate-3 hover:rotate-6 transition-transform cursor-default">
          <Droplet size={64} strokeWidth={2.5} className="transform -rotate-3" />
        </div>
        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Vegas La Vega</h1>
        <p className="text-lg text-gray-500 mt-3 font-medium">Smart Irrigation for Urban Trees</p>
      </div>

      {/* Role Selection Cards */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
        
        {/* Citizen App Card */}
        <button
          onClick={() => navigate('/citizen')}
          className="flex flex-col items-center text-center p-10 bg-white border-2 border-gray-100 rounded-3xl shadow-sm hover:border-earthy-green hover:shadow-xl transition-all duration-300 group active:scale-[0.98]"
        >
          <div className="w-24 h-24 rounded-full bg-earthy-green/10 flex items-center justify-center group-hover:bg-earthy-green/20 transition-colors mb-6">
            <Map className="text-earthy-green" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-earthy-green transition-colors mb-3">Citizen Volunteer App</h2>
          <p className="text-gray-500 leading-relaxed">
            Gamified mobile app for citizens to explore thirsty trees, track impact, and join the watering network.
          </p>
        </button>

        {/* Driver App Card */}
        <button
          onClick={() => navigate('/enterprise')}
          className="flex flex-col items-center text-center p-10 bg-white border-2 border-gray-100 rounded-3xl shadow-sm hover:border-water-drop-blue hover:shadow-xl transition-all duration-300 group active:scale-[0.98]"
        >
          <div className="w-24 h-24 rounded-full bg-water-drop-blue/10 flex items-center justify-center group-hover:bg-water-drop-blue/20 transition-colors mb-6">
            <Sprout className="text-water-drop-blue" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-water-drop-blue transition-colors mb-3">Field Technician App</h2>
          <p className="text-gray-500 leading-relaxed">
            Mobile routing tool for city field-workers to sync sensors and navigate optimized watering routes.
          </p>
        </button>

        {/* Admin Portal Card */}
        <button
          onClick={() => navigate('/admin')}
          className="flex flex-col items-center text-center p-10 bg-gray-900 border-2 border-gray-900 rounded-3xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group active:scale-[0.98]"
        >
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors mb-6">
            <Briefcase className="text-white" size={48} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">City Operations Portal</h2>
          <p className="text-gray-400 leading-relaxed">
            Full-screen Desktop Command Center for city officials to analyze sensor telemetry and fleet metrics.
          </p>
        </button>

      </div>
    </div>
  );
}
