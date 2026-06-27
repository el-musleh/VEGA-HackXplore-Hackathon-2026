import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Radio, Flame, LineChart, MapPin } from 'lucide-react';
import clsx from 'clsx';
import treesData from '../data/trees.json';

function EnterpriseBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { to: '/enterprise/overview', icon: LayoutDashboard, label: 'Overview' },
    { to: '/enterprise/routes', icon: MapPin, label: 'Routes' },
    { to: '/enterprise/fleet', icon: Radio, label: 'Sensors' },
    { to: '/enterprise/alerts', icon: Flame, label: 'Alerts' },
  ];

  const renderTab = (tab) => {
    const isActive = location.pathname.startsWith(tab.to);
    return (
      <button 
        key={tab.to}
        onClick={() => navigate(tab.to)}
        className="flex flex-col items-center justify-center w-16"
      >
        <tab.icon 
          size={24} 
          className={clsx(
            "transition-all duration-300",
            isActive ? "text-earthy-green scale-110" : "text-gray-400"
          )} 
        />
        <span className={clsx(
          "text-[10px] mt-1 font-bold transition-all",
          isActive ? "text-earthy-green" : "text-gray-400"
        )}>
          {tab.label}
        </span>
      </button>
    );
  };

  return (
    <div className="absolute bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-2 py-2 flex justify-evenly items-center z-[500] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl">
      {tabs.map(renderTab)}
    </div>
  );
}

export default function EnterpriseLayout() {
  // Load full dataset for the government, but slice to 300 for map performance if needed
  const [trees, setTrees] = useState(treesData.slice(0, 300));
  
  return (
    <div className="flex flex-col h-full w-full bg-gray-bg relative overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-[90px] bg-gray-bg">
        {/* Pass down global enterprise state via Context */}
        <Outlet context={{ trees, setTrees }} />
      </div>
      
      <EnterpriseBottomNav />
    </div>
  );
}
