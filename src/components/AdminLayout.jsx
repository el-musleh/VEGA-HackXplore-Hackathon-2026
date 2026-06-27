import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Server, Users, MapPin, Settings, LogOut, Trees, Map, LineChart } from 'lucide-react';
import clsx from 'clsx';
import { useGlobalState } from '../context/GlobalState';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { trees } = useGlobalState();

  const navItems = [
    { to: '/admin/overview', icon: LayoutDashboard, label: 'Overview' },
    { to: '/admin/map', icon: Map, label: 'Live Map' },
    { to: '/admin/routes', icon: MapPin, label: 'Fleet & Dispatch' },
    { to: '/admin/hardware', icon: Server, label: 'IoT Hardware' },
    { to: '/admin/community', icon: Users, label: 'Community Hub' },
    { to: '/admin/analytics', icon: LineChart, label: 'Analytics' },
  ];

  return (
    <div className="flex h-screen w-full bg-gray-50 overflow-hidden font-sans">
      
      {/* Left Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 flex flex-col h-full shadow-sm z-10">
        
        {/* Logo Area */}
        <div className="h-20 flex items-center px-8 border-b border-gray-100 mb-6">
          <div className="w-10 h-10 bg-earthy-green rounded-xl flex items-center justify-center mr-3 shadow-md shadow-earthy-green/20">
            <Trees className="text-white" size={20} />
          </div>
          <div>
            <h1 className="font-black text-gray-900 text-lg tracking-tight leading-none">EcoGuardian</h1>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Admin Portal</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.to);
            return (
              <button
                key={item.to}
                onClick={() => navigate(item.to)}
                className={clsx(
                  "w-full flex items-center px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200",
                  isActive 
                    ? "bg-earthy-green text-white shadow-md shadow-earthy-green/20" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                )}
              >
                <item.icon size={20} className={clsx("mr-3", isActive ? "text-white" : "text-gray-400")} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-6 border-t border-gray-100 space-y-3">
          <button className="flex items-center text-sm font-bold text-gray-500 hover:text-gray-900 w-full px-2 transition-colors">
            <Settings size={18} className="mr-3 text-gray-400" /> Settings
          </button>
          <button 
            onClick={() => navigate('/gateway')}
            className="flex items-center text-sm font-bold text-red-500 hover:text-red-700 w-full px-2 transition-colors"
          >
            <LogOut size={18} className="mr-3 text-red-400" /> Exit Desktop Portal
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-gray-50/50 p-10">
        <div className="max-w-7xl mx-auto">
          <Outlet context={{ trees }} />
        </div>
      </main>

    </div>
  );
}
