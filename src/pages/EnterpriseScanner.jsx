import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, CheckCircle, MapPin, Loader2, Wifi, Layers, Settings, Activity, Smartphone, Bluetooth, RefreshCw } from 'lucide-react';

export default function EnterpriseScanner() {
  const navigate = useNavigate();
  const [pairingState, setPairingState] = useState('idle'); // idle, nfc, ble, sync, paired
  const [treeName, setTreeName] = useState('Linden (Tilia)');
  const [lat, setLat] = useState('49.0069');
  const [lon, setLon] = useState('8.4038');
  const [deveui, setDeveui] = useState('00-80-E1-15-2C-3A-4F-9E');
  const [smartValve, setSmartValve] = useState(true);
  const [frequency, setFrequency] = useState('1h');
  const [submitted, setSubmitted] = useState(false);

  const startPairingSequence = () => {
    setPairingState('nfc');
    
    // Step 1: NFC Wakeup -> BLE Connection after 1.2s
    setTimeout(() => {
      setPairingState('ble');
      
      // Step 2: BLE -> Data Sync after 1.2s
      setTimeout(() => {
        setPairingState('sync');
        
        // Step 3: Sync -> Paired Form autofilled after 1.0s
        setTimeout(() => {
          setPairingState('paired');
        }, 1000);
      }, 1200);
    }, 1200);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setPairingState('idle');
    setSubmitted(false);
  };

  // 1. Success Screen (Node registered)
  if (submitted) {
    return (
      <div className="min-h-full bg-gray-bg p-6 flex flex-col justify-center items-center text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 bg-earthy-green/10 rounded-full flex items-center justify-center mb-6 shadow-sm border border-earthy-green/20">
          <CheckCircle className="text-earthy-green" size={48} />
        </div>
        <h1 className="text-3xl font-black text-gray-900 leading-tight mb-2">Node Deployed!</h1>
        <p className="text-gray-500 text-sm font-medium mb-8 max-w-xs">
          The node has been paired, registered, and calibration data verified. Telemetry is streaming live.
        </p>

        <div className="w-full bg-white rounded-3xl p-5 border border-gray-100 shadow-xl space-y-3 mb-8 text-left">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metadata Summary</p>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-xs text-gray-400 font-bold uppercase">Asset Link</span>
            <span className="text-xs text-gray-900 font-black">{treeName}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-xs text-gray-400 font-bold uppercase">DevEUI</span>
            <span className="text-xs text-gray-900 font-mono font-black">{deveui}</span>
          </div>
          <div className="flex justify-between border-b border-gray-50 pb-2">
            <span className="text-xs text-gray-400 font-bold uppercase">GPS coords</span>
            <span className="text-xs text-gray-900 font-black">{lat}, {lon}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-gray-400 font-bold uppercase">Calibration Status</span>
            <span className="text-xs text-earthy-green font-black">Pre-configured (OK)</span>
          </div>
        </div>

        <div className="space-y-3 w-full">
          <button 
            onClick={() => navigate('/enterprise/routes')}
            className="w-full py-4 bg-earthy-green hover:bg-green-600 text-white rounded-2xl font-black shadow-lg shadow-earthy-green/20 transition-transform active:scale-95 text-lg"
          >
            Show on Map
          </button>
          
          <button 
            onClick={handleReset}
            className="w-full py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-black shadow-sm transition-transform active:scale-95 text-lg hover:bg-gray-50"
          >
            Configure Another Node
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-bg p-6 pb-24 flex flex-col space-y-6">
      
      {/* Header */}
      <header>
        <h1 className="text-2xl font-black tracking-tight text-gray-900">Pair & Calibrate Node</h1>
        <p className="text-gray-500 mt-1 text-sm font-medium">Link new IoT node hardware to city assets.</p>
      </header>

      {/* 2. Initial Scanning / Discovering Interface */}
      {pairingState === 'idle' && (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center space-y-6 py-12 animate-in zoom-in-95">
          <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center shadow-lg relative">
            <div className="absolute inset-0 bg-gray-900/10 rounded-full animate-ping" />
            <Smartphone className="text-white" size={40} />
          </div>
          <div>
            <h2 className="text-lg font-black text-gray-900">Search for Deployed Node</h2>
            <p className="text-xs text-gray-500 font-medium mt-2 max-w-xs mx-auto leading-relaxed">
              Activate your phone's NFC or Bluetooth and hold it near the sensor node housing to read hardware metadata.
            </p>
          </div>
          
          <button
            onClick={startPairingSequence}
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2 hover:bg-gray-800"
          >
            <Bluetooth size={18} className="animate-pulse" />
            Initiate NFC/BLE Pair
          </button>
        </div>
      )}

      {/* 3. Simulated Connection Progress Sequence */}
      {(pairingState === 'nfc' || pairingState === 'ble' || pairingState === 'sync') && (
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center space-y-6 py-12 animate-in zoom-in-95">
          
          {pairingState === 'nfc' && (
            <>
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center shadow-sm border border-gray-100 relative">
                <div className="absolute inset-0 bg-gray-950/5 rounded-full animate-ping" />
                <Smartphone className="text-gray-900 animate-bounce" size={32} />
              </div>
              <div>
                <h3 className="font-black text-gray-900">NFC Handshake</h3>
                <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed max-w-xs mx-auto">
                  Hold phone near device tag to transmit bootstrap network identifiers...
                </p>
              </div>
            </>
          )}

          {pairingState === 'ble' && (
            <>
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center shadow-sm border border-blue-100 relative">
                <div className="absolute inset-0 bg-blue-500/10 rounded-full animate-ping" />
                <Bluetooth className="text-blue-500 animate-pulse" size={32} />
              </div>
              <div>
                <h3 className="font-black text-gray-900">Connecting via BLE</h3>
                <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed max-w-xs mx-auto">
                  Bluetooth authentication key accepted. Opening diagnostic channel...
                </p>
              </div>
            </>
          )}

          {pairingState === 'sync' && (
            <>
              <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center shadow-sm border border-amber-100">
                <RefreshCw className="text-amber-500 animate-spin" size={32} />
              </div>
              <div>
                <h3 className="font-black text-gray-900">Syncing Diagnostics</h3>
                <p className="text-xs text-gray-500 font-medium mt-1 leading-relaxed max-w-xs mx-auto">
                  Downloading DevEUI, pre-loaded calibration baselines, and GPS position...
                </p>
              </div>
            </>
          )}

          <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden mt-4">
            <div className={`h-full rounded-full transition-all bg-gray-900 ${
              pairingState === 'nfc' ? 'w-1/3' :
              pairingState === 'ble' ? 'w-2/3' : 'w-[90%]'
            }`} />
          </div>
        </div>
      )}

      {/* 4. Autofilled Configuration Form (Detected State) */}
      {pairingState === 'paired' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 space-y-6 animate-in slide-in-from-bottom-8">
          
          <div className="bg-green-50/50 border border-green-100 p-4 rounded-2xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
              <CheckCircle className="text-earthy-green" size={18} />
            </div>
            <div>
              <p className="text-xs font-black text-earthy-green">Node Diagnostics Verified</p>
              <p className="text-[10px] text-gray-500 mt-0.5">Device settings pre-loaded successfully via BLE</p>
            </div>
          </div>

          {/* Section 1: Asset Link */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <Layers size={16} className="text-gray-400" />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Asset Link</h2>
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Target Tree</label>
              <select 
                value={treeName}
                onChange={(e) => setTreeName(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-earthy-green font-bold text-gray-800 shadow-sm"
              >
                <option value="Linden (Tilia)">Linden (Tilia) · ID #884</option>
                <option value="Maple (Acer)">Maple (Acer) · ID #842</option>
                <option value="Oak (Quercus)">Oak (Quercus) · ID #812</option>
                <option value="Beech (Fagus)">Beech (Fagus) · ID #798</option>
              </select>
            </div>
          </div>

          {/* Section 2: Location settings (Autofilled via GPS) */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <MapPin size={16} className="text-gray-400" />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Location (Autofilled)</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Latitude</label>
                <input 
                  type="text" 
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-earthy-green font-bold text-gray-800 shadow-sm cursor-not-allowed"
                  disabled
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">Longitude</label>
                <input 
                  type="text" 
                  value={lon}
                  onChange={(e) => setLon(e.target.value)}
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-earthy-green font-bold text-gray-800 shadow-sm cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
          </div>

          {/* Section 3: Hardware Settings */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <Settings size={16} className="text-gray-400" />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">LoRaWAN Settings</h2>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Device DevEUI</label>
              <input 
                type="text"
                value={deveui}
                onChange={(e) => setDeveui(e.target.value)}
                required
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-earthy-green font-mono font-bold text-gray-800 shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-gray-700 uppercase tracking-wider block">Transmission Frequency</label>
              <select 
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-earthy-green font-bold text-gray-800 shadow-sm"
              >
                <option value="15m">Every 15 min (Real-time Calibration)</option>
                <option value="1h">Hourly (Optimized Battery Life)</option>
                <option value="6h">Every 6 hours (Max Eco Mode)</option>
              </select>
            </div>
          </div>

          {/* Section 4: Pre-configured Calibration Notice */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-50">
              <Activity size={16} className="text-gray-400" />
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Soil Calibration</h2>
            </div>
            
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 flex flex-col space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase tracking-wider">Calibration Status</span>
                <span className="text-blue-600 font-black">Pre-configured (Lab)</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-blue-100/50">
                <span className="text-gray-500 font-bold uppercase tracking-wider">Dry Base (0% RF)</span>
                <span className="text-gray-800 font-mono font-black">120 Hz</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-bold uppercase tracking-wider">Wet Base (100% RF)</span>
                <span className="text-gray-800 font-mono font-black">450 Hz</span>
              </div>
            </div>
          </div>

          {/* Section 5: Smart Valve Toggle */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div>
              <h3 className="font-bold text-gray-900 text-sm">Automated Smart Valve</h3>
              <p className="text-[10px] text-gray-400 font-medium">Enable remote triggers for water delivery</p>
            </div>
            <input 
              type="checkbox"
              checked={smartValve}
              onChange={(e) => setSmartValve(e.target.checked)}
              className="w-10 h-6 bg-gray-200 rounded-full cursor-pointer focus:outline-none accent-earthy-green"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-4 bg-gray-900 text-white rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2 hover:bg-gray-800"
          >
            <PlusCircle size={20} />
            Register Deployed Node
          </button>
        </form>
      )}
    </div>
  );
}
