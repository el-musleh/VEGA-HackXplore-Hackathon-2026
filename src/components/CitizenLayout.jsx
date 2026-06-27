import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Map as MapIcon, Trophy, ScanLine, FileWarning, User, CheckCircle2, X } from 'lucide-react';
import clsx from 'clsx';
import { useGlobalState } from '../context/GlobalState';

function CitizenBottomNav({ onScan }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { to: '/citizen/map', icon: MapIcon, label: 'Map' },
    { to: '/citizen/leaderboard', icon: Trophy, label: 'Ranks' },
  ];

  const tabsRight = [
    { to: '/citizen/report', icon: FileWarning, label: 'Report' },
    { to: '/citizen/profile', icon: User, label: 'Profile' },
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
    <div className="absolute bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-2 py-2 flex justify-between items-center z-[500] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl">
      <div className="flex flex-1 justify-evenly">
        {tabs.map(renderTab)}
      </div>

      {/* Massive Center Scan Button */}
      <div className="relative -top-6 flex justify-center w-20">
        <button 
          onClick={onScan}
          className="absolute w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-transform border-4 border-white-bg"
        >
          <ScanLine className="text-white" size={28} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-1 justify-evenly">
        {tabsRight.map(renderTab)}
      </div>
    </div>
  );
}

export default function CitizenLayout() {
  const { trees, ecoPoints, waterTree } = useGlobalState();
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  
  // Simulated User Location
  const USER_LOC = [48.970698, 8.480784];

  const handleScan = (treeId = null) => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setScanSuccess(true);
      
      if (treeId) {
        waterTree(treeId);
      } else {
        // Global scan button pressed, hydrate the driest tree as a mockup
        const driest = [...trees].sort((a,b) => a.moisture - b.moisture)[0];
        if (driest) waterTree(driest.id);
      }
    }, 2000);
  };

  const handleRemoteWater = (id) => {
    // Simulated short delay for animation
    setTimeout(() => {
      waterTree(id);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-gray-bg w-full">
      
      {/* Outlet renders the child route content */}
      <div className="flex-1 overflow-y-auto pb-[90px]">
        <Outlet context={{ ecoPoints, trees, handleScan, handleRemoteWater }} />
      </div>

      {/* Dedicated Citizen Bottom Nav */}
      <CitizenBottomNav onScan={() => handleScan(null)} />

      {/* Global Scanning Modal Overlay */}
      {(isScanning || scanSuccess) && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in-down">
          
          {isScanning ? (
            <div className="flex flex-col items-center">
              <div className="relative w-64 h-64 border-4 border-water-drop-blue/50 rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-water-drop-blue/10 animate-pulse" />
                <div className="absolute top-0 left-0 w-full h-1 bg-water-drop-blue shadow-[0_0_15px_rgba(3,169,244,1)] animate-[scan_2s_ease-in-out_infinite]" />
                
                {/* Mock Camera Viewfinder UI */}
                <div className="absolute top-4 left-4 w-6 h-6 border-t-4 border-l-4 border-white" />
                <div className="absolute top-4 right-4 w-6 h-6 border-t-4 border-r-4 border-white" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b-4 border-l-4 border-white" />
                <div className="absolute bottom-4 right-4 w-6 h-6 border-b-4 border-r-4 border-white" />
              </div>
              <p className="text-white font-bold mt-6 flex items-center text-lg">
                <ScanLine className="mr-2 animate-bounce" /> Scanning QR Tag...
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col items-center text-center relative shadow-2xl">
              <button 
                onClick={() => setScanSuccess(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
              
              <div className="w-20 h-20 bg-earthy-green/10 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="text-earthy-green" size={48} />
              </div>
              
              <h2 className="text-3xl font-black text-gray-800 mb-2">Success!</h2>
              <p className="text-gray-500 font-medium mb-6">You hydrated a tree and helped your community thrive.</p>
              
              <div className="w-full bg-gray-bg rounded-2xl p-4 mb-6">
                <p className="text-sm font-bold text-gray-500 uppercase">Reward Earned</p>
                <p className="text-4xl font-black text-earthy-green">+50 pts</p>
              </div>

              <button 
                onClick={() => setScanSuccess(false)}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                Continue
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
