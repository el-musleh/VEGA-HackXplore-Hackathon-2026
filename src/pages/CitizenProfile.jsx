import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useGlobalState } from '../context/GlobalState';
import { Droplet, Wind, ShieldCheck, Sun, Star, TreePine, Thermometer, Camera, AlertTriangle, Sprout, Hammer, Trash, Send, CheckCircle, X } from 'lucide-react';

export default function CitizenProfile() {
  const { ecoPoints } = useOutletContext();
  const { addTicket } = useGlobalState();
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const issueTypes = [
    { id: 'sick', icon: Sprout, label: "Tree Looks Sick" },
    { id: 'broken', icon: AlertTriangle, label: "Broken Branches" },
    { id: 'trash', icon: Trash, label: "Trash Dumped" },
    { id: 'sensor', icon: Hammer, label: "Sensor Smashed" }
  ];

  const handleCameraClick = () => {
    setHasPhoto(true);
  };

  const handleSubmit = () => {
    if (!selectedIssue) return;
    addTicket("Linden (#884)", selectedIssue); // Dynamic global register
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setSelectedIssue(null);
      setHasPhoto(false);
    }, 4000);
  };
  
  // Mock impact data based on points
  const litersDonated = Math.floor(ecoPoints / 2.5); // Metric conversion
  const co2Offset = (litersDonated * 0.15).toFixed(1); 
  const coolingEffect = (litersDonated * 0.02).toFixed(1); // Estimated cooling capacity maintained
  const treesHelped = Math.floor(litersDonated / 20); // Number of thirsty trees helped

  const badges = [
    { icon: ShieldCheck, name: "Mighty Oak", desc: "Top 10% of waterers", color: "text-amber-600", bg: "bg-amber-100" },
    { icon: Sun, name: "Heatwave Hero", desc: "Watered during +35°C", color: "text-red-500", bg: "bg-red-100" },
    { icon: Star, name: "Early Bird", desc: "Watered before 8 AM", color: "text-blue-500", bg: "bg-blue-100" }
  ];

  return (
    <div className="min-h-full bg-gray-bg flex flex-col pb-8">
      
      {/* Header Profile */}
      <header className="bg-white p-6 rounded-b-[40px] shadow-sm border-b border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Alex's Impact</h1>
            <p className="text-gray-500 font-medium mt-1">Level 42: Mighty Oak</p>
          </div>
          <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center font-black text-white text-xl shadow-lg">
            AL
          </div>
        </div>

        <div className="bg-earthy-green/10 p-5 rounded-3xl border border-earthy-green/20">
          <p className="text-xs font-bold text-earthy-green uppercase tracking-widest mb-1">Total Points</p>
          <p className="text-4xl font-black text-earthy-green">{ecoPoints.toLocaleString()}</p>
        </div>
      </header>

      <div className="px-6 space-y-8">
        
        {/* Real-World Impact */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Real-World Impact</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <Droplet size={24} className="text-blue-500 mb-3" />
              <p className="text-3xl font-black text-gray-900">{litersDonated}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Liters Donated</p>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <Wind size={24} className="text-teal-500 mb-3" />
              <p className="text-3xl font-black text-gray-900">{co2Offset}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Kg CO2 Offset</p>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <Thermometer size={24} className="text-orange-500 mb-3" />
              <p className="text-3xl font-black text-gray-900">-{coolingEffect}°C</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Cooling Effect</p>
            </div>
            <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
              <TreePine size={24} className="text-earthy-green mb-3" />
              <p className="text-3xl font-black text-gray-900">{treesHelped}</p>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Trees Helped</p>
            </div>
          </div>
        </div>

        {/* Badges Collection */}
        <div>
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Badge Collection</h2>
          <div className="space-y-3">
            {badges.map((badge, idx) => (
              <div key={idx} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 ${badge.bg} ${badge.color}`}>
                  <badge.icon size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{badge.name}</h3>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Adopt-a-Tree */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Adopted Trees</h2>
            <span className="text-xs font-bold text-earthy-green bg-earthy-green/10 px-2 py-1 rounded-lg">1 Active</span>
          </div>
          
          <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 flex items-start relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 opacity-5">
              <TreePine size={120} className="text-gray-900" />
            </div>
            
            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4 shrink-0 relative z-10">
              <TreePine size={24} className="text-gray-400" />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-gray-900">Maple (#842)</h3>
              <p className="text-xs text-gray-500 mt-0.5">Kaiserstraße 12</p>
              
              <div className="mt-4 flex items-center">
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mr-3">
                  <div className="h-full bg-earthy-green rounded-full w-[85%]" />
                </div>
                <span className="text-[10px] font-bold text-gray-400">85% Health</span>
              </div>
            </div>
          </div>
        </div>

        {/* Civic Eyes - Report an Issue (Merged Content) */}
        <div className="pt-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Report a Problem (Civic Eyes)</h2>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            {submitted ? (
              <div className="py-6 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                <CheckCircle size={48} className="text-earthy-green mb-4 animate-bounce" />
                <h3 className="text-lg font-black text-gray-900">Report Submitted!</h3>
                <p className="text-xs text-gray-500 mt-2">Thank you! City operations has been alerted and will dispatch help soon.</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-3">Notice something wrong with a city tree or sensor? Let us know:</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    {issueTypes.map((type) => (
                      <button 
                        key={type.id}
                        type="button"
                        onClick={() => setSelectedIssue(type.label)}
                        className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 text-left transition-all ${
                          selectedIssue === type.label 
                            ? 'border-gray-900 bg-gray-50' 
                            : 'border-gray-100 bg-white hover:border-gray-200'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                          selectedIssue === type.label ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-500'
                        }`}>
                          <type.icon size={14} />
                        </div>
                        <span className="font-bold text-gray-900 text-xs leading-tight">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {selectedIssue && (
                  <div className="animate-in slide-in-from-bottom-2 space-y-4 pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Evidence Photo</p>
                      {hasPhoto ? (
                        <div className="relative h-28 bg-gray-900 rounded-xl overflow-hidden flex items-center justify-center">
                          <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1596767554902-1811eef2a912?auto=format&fit=crop&q=80')] bg-cover bg-center" />
                          <button 
                            type="button"
                            onClick={() => setHasPhoto(false)}
                            className="absolute top-2 right-2 bg-black/50 p-1.5 rounded-full text-white hover:bg-black/70 backdrop-blur-md z-20"
                          >
                            <X size={12} />
                          </button>
                          <p className="absolute bottom-2 left-3 text-white text-[9px] font-bold tracking-widest uppercase z-10">
                            Evidence_Snapshot.jpg
                          </p>
                        </div>
                      ) : (
                        <button 
                          type="button"
                          onClick={handleCameraClick}
                          className="w-full h-28 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 hover:border-gray-300 transition-colors"
                        >
                          <Camera size={18} className="text-gray-400 mb-1" />
                          <span className="font-bold text-gray-900 text-xs">Snap Photo</span>
                        </button>
                      )}
                    </div>

                    <button 
                      type="button"
                      onClick={handleSubmit}
                      className="w-full py-3 rounded-xl font-bold text-sm bg-gray-900 text-white shadow-md active:scale-95 transition-transform flex items-center justify-center gap-2"
                    >
                      <Send size={14} />
                      Submit Report
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
