import { useNavigate } from 'react-router-dom';
import { Droplet, Map, Sprout, Briefcase } from 'lucide-react';

export default function Gateway() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-full items-center justify-center p-6 bg-white-bg">
      {/* Logo Area */}
      <div className="flex flex-col items-center mb-12 animate-fade-in-down">
        <div className="w-24 h-24 bg-water-drop-blue/10 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-water-drop-blue/20">
          <Droplet className="text-water-drop-blue" size={48} strokeWidth={2} />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 tracking-tight">AquaSync</h1>
        <p className="text-sm text-gray-500 mt-2 font-medium">Smart Irrigation for Everyone</p>
      </div>

      {/* Role Selection Buttons */}
      <div className="w-full space-y-4">
        <button
          onClick={() => navigate('/citizen')}
          className="w-full flex items-center p-5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-earthy-green hover:shadow-md transition-all duration-200 group active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-earthy-green/10 flex items-center justify-center group-hover:bg-earthy-green/20 transition-colors">
            <Map className="text-earthy-green" size={24} />
          </div>
          <div className="ml-4 text-left">
            <h2 className="text-lg font-bold text-gray-800 group-hover:text-earthy-green transition-colors">Join the Community</h2>
            <p className="text-xs text-gray-500">Explore the map & scan trees</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/homeowner')}
          className="w-full flex items-center p-5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-water-drop-blue hover:shadow-md transition-all duration-200 group active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-water-drop-blue/10 flex items-center justify-center group-hover:bg-water-drop-blue/20 transition-colors">
            <Sprout className="text-water-drop-blue" size={24} />
          </div>
          <div className="ml-4 text-left">
            <h2 className="text-lg font-bold text-gray-800 group-hover:text-water-drop-blue transition-colors">Manage My Home</h2>
            <p className="text-xs text-gray-500">View your personal plant jungle</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/enterprise')}
          className="w-full flex items-center p-5 bg-white border-2 border-gray-100 rounded-2xl shadow-sm hover:border-gray-800 hover:shadow-md transition-all duration-200 group active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors">
            <Briefcase className="text-gray-700" size={24} />
          </div>
          <div className="ml-4 text-left">
            <h2 className="text-lg font-bold text-gray-800">Parks Dept (Mobile App)</h2>
            <p className="text-xs text-gray-500">Field agent mobile tools</p>
          </div>
        </button>

        <button
          onClick={() => navigate('/admin')}
          className="w-full flex items-center p-5 bg-gray-900 border-2 border-gray-900 rounded-2xl shadow-md hover:shadow-xl transition-all duration-200 group active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Briefcase className="text-white" size={24} />
          </div>
          <div className="ml-4 text-left">
            <h2 className="text-lg font-bold text-white">Parks Dept (Desktop)</h2>
            <p className="text-xs text-gray-400">Full-screen Baumkataster portal</p>
          </div>
        </button>
      </div>
    </div>
  );
}
