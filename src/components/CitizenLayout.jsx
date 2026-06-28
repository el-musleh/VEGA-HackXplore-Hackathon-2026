import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Map as MapIcon, Trophy, Radar, Gift, User, CheckCircle2, X, TreePine, Home, Smartphone, Bluetooth, RefreshCw } from 'lucide-react';
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
    { to: '/citizen/rewards', icon: Gift, label: 'Rewards' },
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
          <Radar className="text-white animate-pulse" size={28} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex flex-1 justify-evenly">
        {tabsRight.map(renderTab)}
      </div>
    </div>
  );
}

export default function CitizenLayout() {
  const navigate = useNavigate();
  const { trees, ecoPoints, waterTree } = useGlobalState();
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [pairingStep, setPairingStep] = useState('nfc'); // nfc, ble, sync
  const [isWateringFlow, setIsWateringFlow] = useState(false);
  
  // Simulated User Location
  const USER_LOC = [48.970698, 8.480784];

  const handleScan = (treeId = null, skipScan = false) => {
    if (skipScan) {
      setIsWateringFlow(true);
      setScanSuccess(true);
      if (treeId) {
        waterTree(treeId);
      }
      return;
    }
    
    // Middle Radar button scan - only read diagnostics info
    setIsWateringFlow(false);
    setIsScanning(true);
    setPairingStep('nfc');
    
    // Step 1: NFC Wakeup -> BLE Connection after 1.5s
    setTimeout(() => {
      setPairingStep('ble');
      
      // Step 2: BLE -> Data Sync after 1.5s
      setTimeout(() => {
        setPairingStep('sync');
        
        // Step 3: Sync -> Success after 1.2s
        setTimeout(() => {
          setIsScanning(false);
          setScanSuccess(true);
        }, 1200);
      }, 1500);
    }, 1500);
  };

  const handleRemoteWater = (id) => {
    // Simulated short delay for animation
    setTimeout(() => {
      waterTree(id);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full relative overflow-hidden bg-gray-bg w-full">
      
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center z-[500] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-earthy-green rounded-xl flex items-center justify-center">
            <TreePine size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-gray-900 text-sm tracking-tight leading-none">Citizen Volunteer App</h1>
            <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Karlsruhe</p>
          </div>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          title="Return to Home"
        >
          <Home size={18} />
        </button>
      </div>

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
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col items-center text-center shadow-2xl border border-gray-100 animate-in zoom-in-95">
              {pairingStep === 'nfc' && (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100 relative">
                    <div className="absolute inset-0 rounded-full bg-gray-900/5 animate-ping" />
                    <Smartphone className="text-gray-900 animate-bounce" size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">NFC Wake Up</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                      Hold your phone near the base of the tree to wake up the sensor node...
                    </p>
                  </div>
                </div>
              )}

              {pairingStep === 'ble' && (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto shadow-sm border border-blue-100 relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500/10 animate-ping" />
                    <Bluetooth className="text-blue-500 animate-pulse" size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">BLE Connection</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                      Secure bluetooth connection established. Reading node identifiers...
                    </p>
                  </div>
                </div>
              )}

              {pairingStep === 'sync' && (
                <div className="space-y-6">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto shadow-sm border border-amber-100">
                    <RefreshCw className="text-amber-500 animate-spin" size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-gray-900">Synchronizing Data</h3>
                    <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                      Acquiring soil moisture percentage, battery status, and LoRaWAN packet keys...
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : isWateringFlow ? (
            /* 1. Points Success Overlay (Watering complete) */
            <div className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col items-center text-center relative shadow-2xl border border-gray-100 animate-in zoom-in-95">
              <button 
                onClick={() => setScanSuccess(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="w-20 h-20 bg-earthy-green/10 rounded-full flex items-center justify-center mb-4 border border-earthy-green/20">
                <CheckCircle2 className="text-earthy-green" size={48} />
              </div>
              
              <h2 className="text-3xl font-black text-gray-800 mb-2">Success!</h2>
              <p className="text-gray-500 font-medium mb-6">You watered a community tree and logged it successfully!</p>
              
              <div className="w-full bg-gray-50 rounded-2xl p-4 mb-6 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Reward Earned</p>
                <p className="text-4xl font-black text-earthy-green mt-1">+50 pts</p>
              </div>

              <button 
                onClick={() => setScanSuccess(false)}
                className="w-full py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                Continue
              </button>
            </div>
          ) : (
            /* 2. Device Diagnostics Overlay (Middle Radar scan) */
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col relative shadow-2xl border border-gray-100 animate-in zoom-in-95">
              <button 
                onClick={() => setScanSuccess(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100">
                  <Bluetooth className="text-blue-500" size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-black text-gray-900 leading-none">Device Diagnostics</h2>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-green-600 uppercase tracking-wider">BLE Active Link</span>
                  </div>
                </div>
              </div>

              {/* Hardware specifications list */}
              <div className="space-y-3.5 mb-6">
                <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-wider">Device ID</span>
                    <span className="font-mono font-black text-gray-900">#884 (Linden)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-wider">MAC Address</span>
                    <span className="font-mono text-gray-800 font-bold">00:1B:44:11:3A:4C</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold uppercase tracking-wider">Signal (RSSI)</span>
                    <span className="text-gray-800 font-bold">-62 dBm (Excellent)</span>
                  </div>
                </div>

                <div className="bg-blue-50/30 border border-blue-50 rounded-2xl p-4 space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-500 font-bold uppercase tracking-wider">Soil Moisture</span>
                    <span className="font-black text-blue-600">34% (Dry)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-500 font-bold uppercase tracking-wider">Node Battery</span>
                    <span className="font-black text-blue-600">78% (Healthy)</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-blue-500 font-bold uppercase tracking-wider">Tx Interval</span>
                    <span className="font-black text-blue-600">Hourly packets</span>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => setScanSuccess(false)}
                className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-lg hover:bg-gray-800 transition-colors active:scale-95 transition-transform text-sm"
              >
                Disconnect BLE Link
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
