import { useState } from 'react';
import { ScanLine, CheckCircle, Clock, Server, RefreshCw, SmartphoneNfc } from 'lucide-react';

export default function EnterpriseScanner() {
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState(null);

  const simulateScan = () => {
    setIsScanning(false);
    setTimeout(() => {
      setScanResult({
        id: 884,
        mac: "00:1B:44:11:3A:4C",
        name: "Linden (Tilia)",
        status: "Online",
        battery: 12,
        history: [
          { date: "Oct 12, 2023", action: "Battery Replaced" },
          { date: "Mar 04, 2023", action: "Firmware Updated v2.1" },
          { date: "Nov 22, 2022", action: "Initial Installation" }
        ]
      });
    }, 1500);
  };

  const resetScanner = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col relative overflow-hidden">
      
      <header className="p-6 pb-2 relative z-10">
        <h1 className="text-2xl font-black tracking-tight text-white">Hardware Pairing</h1>
        <p className="text-gray-400 mt-1 text-sm font-medium">Scan QR or tap NFC tag on the sensor housing.</p>
      </header>

      {isScanning && !scanResult ? (
        <div className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pb-12">
          {/* Mock Viewfinder */}
          <div 
            onClick={simulateScan}
            className="w-64 h-64 border-2 border-white/20 rounded-3xl relative flex items-center justify-center cursor-pointer mb-8 shadow-[0_0_50px_rgba(255,255,255,0.05)] bg-white/5 backdrop-blur-sm"
          >
            {/* Viewfinder corners */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-500 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-500 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-500 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-500 rounded-br-2xl"></div>
            
            <div className="relative">
              <ScanLine size={48} className="text-blue-400 animate-pulse" />
            </div>
            
            {/* Scanning line animation */}
            <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/50 shadow-[0_0_15px_#3b82f6] animate-[scan_2s_ease-in-out_infinite]" />
          </div>

          <div className="flex items-center space-x-6 text-gray-400">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
                <ScanLine size={20} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">QR Code</span>
            </div>
            <div className="w-px h-8 bg-white/10"></div>
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mb-2">
                <SmartphoneNfc size={20} className="text-white" />
              </div>
              <span className="text-xs font-bold uppercase tracking-widest">NFC Tap</span>
            </div>
          </div>
          
          <p className="text-center text-xs text-gray-500 font-bold mt-8 uppercase tracking-widest">
            Tap viewfinder to simulate scan
          </p>
        </div>
      ) : scanResult ? (
        <div className="flex-1 bg-gray-bg rounded-t-[40px] p-6 animate-in slide-in-from-bottom-8 flex flex-col mt-4">
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mr-4">
                <CheckCircle className="text-blue-600" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900">Tag Detected</h2>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest font-mono mt-0.5">{scanResult.mac}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6">
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Assigned Asset</p>
                <p className="font-black text-gray-900 text-lg">{scanResult.name} <span className="text-gray-400 text-sm font-bold">#{scanResult.id}</span></p>
              </div>
              <div className="bg-red-50 px-3 py-1.5 rounded-lg border border-red-100 flex flex-col items-center justify-center">
                <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest">Battery</p>
                <p className="font-black text-red-600 leading-none mt-0.5">{scanResult.battery}%</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Maintenance History</p>
              <div className="space-y-4 relative before:absolute before:inset-0 before:ml-2.5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                {scanResult.history.map((item, idx) => (
                  <div key={idx} className="relative flex items-center">
                    <div className="w-5 h-5 rounded-full bg-white border-4 border-gray-200 flex items-center justify-center shrink-0 z-10" />
                    <div className="ml-4 flex-1">
                      <p className="font-bold text-gray-900 text-sm">{item.action}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center mt-0.5">
                        <Clock size={10} className="mr-1" /> {item.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3 mt-auto pb-6">
            <button 
              onClick={() => {
                alert("Pairing workflow initiated. Follow instructions to register new MAC address.");
              }}
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-black py-4 rounded-2xl shadow-lg transition-colors flex items-center justify-center active:scale-95"
            >
              <RefreshCw size={18} className="mr-2" /> Replace Sensor Unit
            </button>
            <button 
              onClick={resetScanner}
              className="w-full bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-2xl shadow-sm transition-colors flex items-center justify-center active:scale-95"
            >
              Scan Another Tag
            </button>
          </div>

        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
           <RefreshCw className="text-white animate-spin" size={32} />
        </div>
      )}
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scan {
          0% { transform: translateY(0); }
          50% { transform: translateY(256px); }
          100% { transform: translateY(0); }
        }
      `}} />
    </div>
  );
}
