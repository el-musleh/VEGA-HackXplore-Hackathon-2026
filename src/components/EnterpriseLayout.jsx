import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Radio, MapPin, ScanLine, FileWarning } from 'lucide-react';
import clsx from 'clsx';

import { useGlobalState } from '../context/GlobalState';

function EnterpriseBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { to: '/enterprise/overview', icon: LayoutDashboard, label: 'Shift' },
    { to: '/enterprise/routes', icon: MapPin, label: 'Map' },
    { to: '/enterprise/scanner', icon: ScanLine, label: 'Scan' },
    { to: '/enterprise/report', icon: FileWarning, label: 'Report' },
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
  const { trees } = useGlobalState();

  return (
    <div className="flex flex-col h-full w-full bg-gray-bg relative overflow-hidden">
      <div className="flex-1 overflow-y-auto pb-[90px] bg-gray-bg">
        <Outlet context={{ trees }} />
      </div>
      
      <EnterpriseBottomNav />
    </div>
  );
}
