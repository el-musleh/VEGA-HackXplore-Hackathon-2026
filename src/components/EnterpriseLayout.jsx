import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Radio, MapPin, PlusCircle, FileWarning, TreePine, Home, Radar, Smartphone, Bluetooth, RefreshCw, X, CheckCircle2, Settings, Activity, Send } from 'lucide-react';
import clsx from 'clsx';
import { useGlobalState } from '../context/GlobalState';

function EnterpriseBottomNav({ onScan }) {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { to: '/enterprise/overview', icon: LayoutDashboard, label: 'Shift' },
    { to: '/enterprise/routes', icon: MapPin, label: 'Map' },
  ];

  const tabsRight = [
    { to: '/enterprise/scanner', icon: PlusCircle, label: 'Add Node' },
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
    <div className="absolute bottom-0 w-full max-w-md bg-white border-t border-gray-100 px-2 py-2 flex justify-between items-center z-[500] shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl">
      <div className="flex flex-1 justify-evenly">
        {tabs.map(renderTab)}
      </div>

      {/* Massive Center Scan Button */}
      <div className="relative -top-6 flex justify-center w-20">
        <button 
          onClick={onScan}
          className="absolute w-16 h-16 bg-gray-950 rounded-full flex items-center justify-center shadow-[0_8px_16px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 transition-transform border-4 border-white-bg"
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

export default function EnterpriseLayout() {
  const navigate = useNavigate();
  const { trees, updateTreeConfig } = useGlobalState();
  const [isScanning, setIsScanning] = useState(false);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [pairingStep, setPairingStep] = useState('nfc'); // nfc, ble, sync

  // Reconfigurable fields state
  const [frequency, setFrequency] = useState('1h');
  const [smartValve, setSmartValve] = useState(true);
  const [calibrationTrim, setCalibrationTrim] = useState(0); // soil moisture trim offset
  const [pingSuccess, setPingSuccess] = useState(false);
  const [pinging, setPinging] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setPairingStep('nfc');
    
    // Step 1: NFC wakeup -> BLE after 1.2s
    setTimeout(() => {
      setPairingStep('ble');
      
      // Step 2: BLE -> Sync after 1.2s
      setTimeout(() => {
        setPairingStep('sync');
        
        // Step 3: Sync -> Diagnostic open after 1s
        setTimeout(() => {
          setIsScanning(false);
          setScanSuccess(true);
        }, 1000);
      }, 1200);
    }, 1200);
  };

  const handlePingTest = () => {
    setPinging(true);
    setTimeout(() => {
      setPinging(false);
      setPingSuccess(true);
      setTimeout(() => setPingSuccess(false), 3000);
    }, 1000);
  };

  const handleApplyConfig = () => {
    updateTreeConfig(884, { hasAutoValve: smartValve, frequency, trimOffset: calibrationTrim });
    alert("Configuration applied and burned to node EEPROM successfully!");
    setScanSuccess(false);
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-bg relative overflow-hidden">
      
      {/* Top Header Bar */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 flex justify-between items-center z-[500] shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gray-950 rounded-xl flex items-center justify-center">
            <TreePine size={16} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-gray-900 text-sm tracking-tight leading-none">Field Technician App</h1>
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

      <div className="flex-1 overflow-y-auto pb-[90px] bg-gray-bg">
        <Outlet context={{ trees }} />
      </div>
      
      <EnterpriseBottomNav onScan={handleScan} />

      {/* NFC & BLE Connecting Overlay (Technician Style) */}
      {isScanning && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in-down">
          <div className="bg-white rounded-3xl p-8 w-full max-w-sm flex flex-col items-center text-center shadow-2xl border border-gray-100 animate-in zoom-in-95">
            {pairingStep === 'nfc' && (
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto shadow-sm border border-gray-100 relative">
                  <div className="absolute inset-0 rounded-full bg-gray-950/5 animate-ping" />
                  <Smartphone className="text-gray-900 animate-bounce" size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-gray-900">Tech NFC Boot</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                    Tap phone against sensor node casing to trigger debug bootstrap...
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
                  <h3 className="text-lg font-black text-gray-900">Debug BLE Tunnel</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                    Opening serial interface via Bluetooth. Verifying security key...
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
                  <h3 className="text-lg font-black text-gray-900">Reading EEPROM</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed">
                    Downloading current node calibration values and smart-valve configs...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Technician Device Diagnostics & RECONFIGURATION Overlay */}
      {scanSuccess && (
        <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-fade-in-down">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm flex flex-col relative shadow-2xl border border-gray-100 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <button 
              onClick={() => setScanSuccess(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
            
            <div className="flex items-center gap-3 mb-5 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-center">
                <Settings className="text-blue-500" size={20} />
              </div>
              <div>
                <h2 className="text-lg font-black text-gray-900 leading-none">Node Reconfiguration</h2>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Writable BLE Tunnel</span>
                </div>
              </div>
            </div>

            {/* Read-Only Node Info */}
            <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 space-y-2 text-xs mb-4">
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold uppercase tracking-wider">Device ID</span>
                <span className="font-mono font-black text-gray-900">#884 (Linden)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold uppercase tracking-wider">MAC Address</span>
                <span className="font-mono text-gray-800 font-bold">00:1B:44:11:3A:4C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400 font-bold uppercase tracking-wider">Sensor Battery</span>
                <span className="font-black text-earthy-green">78% (Healthy)</span>
              </div>
            </div>

            {/* Writable fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Transmission Interval</label>
                <select 
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-800 focus:outline-none focus:border-earthy-green shadow-sm"
                >
                  <option value="15m">Every 15 min (Diagnostic Mode)</option>
                  <option value="1h">Hourly (Optimized Battery)</option>
                  <option value="6h">Every 6 hours (Max Eco Mode)</option>
                </select>
              </div>

              {/* Calibration Trim Offset slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Soil Moisture Trim Offset</label>
                  <span className="text-xs font-black text-blue-600">{calibrationTrim > 0 ? `+${calibrationTrim}` : calibrationTrim}%</span>
                </div>
                <input 
                  type="range" 
                  min="-15" 
                  max="15" 
                  value={calibrationTrim}
                  onChange={(e) => setCalibrationTrim(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <p className="text-[9px] text-gray-400 leading-none">Trim offset to adjust for highly compacted urban soil.</p>
              </div>

              {/* LoRaWAN Signal Ping Test */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handlePingTest}
                  disabled={pinging}
                  className="w-full py-2.5 rounded-xl border border-gray-100 bg-gray-50 text-xs font-bold text-gray-700 hover:bg-gray-100 flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
                >
                  {pinging ? (
                    <><RefreshCw className="animate-spin text-gray-400" size={12} /> Pinging LoRa Gateway...</>
                  ) : pingSuccess ? (
                    <><CheckCircle2 className="text-earthy-green" size={12} /> Ping Success (-72 dBm)</>
                  ) : (
                    <><Activity size={12} className="text-gray-400" /> Test LoRa Gateway Ping</>
                  )}
                </button>
              </div>

              {/* Smart Valve Switch */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div>
                  <h4 className="font-bold text-gray-900 text-xs">Automated Smart Valve</h4>
                  <p className="text-[9px] text-gray-400">Allow remote cloud triggers</p>
                </div>
                <input 
                  type="checkbox"
                  checked={smartValve}
                  onChange={(e) => setSmartValve(e.target.checked)}
                  className="w-8 h-5 bg-gray-200 rounded-full cursor-pointer focus:outline-none accent-earthy-green"
                />
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-2">
                <button 
                  onClick={handleApplyConfig}
                  className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-black text-sm shadow-lg hover:bg-gray-800 transition-transform active:scale-95"
                >
                  Apply & Burn Config
                </button>
                <button 
                  onClick={() => setScanSuccess(false)}
                  className="w-full text-center text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors uppercase tracking-widest pt-1"
                >
                  Cancel & Close Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
