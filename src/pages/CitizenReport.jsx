import { useState } from 'react';
import { Camera, AlertTriangle, Sprout, Hammer, Trash, Send, CheckCircle, X } from 'lucide-react';

export default function CitizenReport() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const issueTypes = [
    { id: 'sick', icon: Sprout, label: "Tree Looks Sick", desc: "Leaves are brown or falling off" },
    { id: 'broken', icon: AlertTriangle, label: "Broken Branches", desc: "Safety hazard on the sidewalk" },
    { id: 'trash', icon: Trash, label: "Trash Dumped", desc: "Garbage around the tree base" },
    { id: 'sensor', icon: Hammer, label: "Sensor Smashed", desc: "IoT device is damaged or missing" }
  ];

  const handleCameraClick = () => {
    setHasPhoto(true);
  };

  const handleSubmit = () => {
    if (!selectedIssue) return;
    setSubmitted(true);
    
    // Reset after showing success
    setTimeout(() => {
      setSubmitted(false);
      setSelectedIssue(null);
      setHasPhoto(false);
    }, 3000);
  };

  if (submitted) {
    return (
      <div className="h-full bg-earthy-green flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <CheckCircle size={64} className="text-white mb-6 animate-bounce" />
        <h1 className="text-3xl font-black text-white mb-2">Report Sent!</h1>
        <p className="text-green-100 font-medium">Thank you for being the civic eyes of your neighborhood. The city dispatch has been notified.</p>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-bg flex flex-col">
      <header className="p-6 bg-white border-b border-gray-100 shrink-0">
        <h1 className="text-2xl font-black tracking-tight text-gray-900">Civic Eyes</h1>
        <p className="text-gray-500 mt-1 text-sm font-medium">Help the city by reporting local issues.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">What's wrong?</h2>
        <div className="grid grid-cols-2 gap-3 mb-8 shrink-0">
          {issueTypes.map((type) => (
            <div 
              key={type.id}
              onClick={() => setSelectedIssue(type.label)}
              className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center cursor-pointer transition-all ${
                selectedIssue === type.label 
                  ? 'border-gray-900 bg-gray-50 shadow-sm' 
                  : 'border-transparent bg-white shadow-sm hover:border-gray-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${
                selectedIssue === type.label ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                <type.icon size={20} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm">{type.label}</h3>
            </div>
          ))}
        </div>

        {selectedIssue && (
          <div className="animate-in slide-in-from-bottom-4 flex-1 flex flex-col">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Add a Photo</h2>
            
            <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 mb-6 shrink-0">
              {hasPhoto ? (
                <div className="relative h-40 bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1596767554902-1811eef2a912?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                  <button 
                    onClick={() => setHasPhoto(false)}
                    className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 backdrop-blur-md z-20"
                  >
                    <X size={16} />
                  </button>
                  <p className="absolute bottom-3 left-4 text-white text-xs font-bold tracking-widest uppercase z-10">
                    Civic_Evidence_1.jpg
                  </p>
                </div>
              ) : (
                <div 
                  onClick={handleCameraClick}
                  className="h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-2">
                    <Camera size={20} />
                  </div>
                  <h3 className="font-bold text-gray-900">Snap a Photo</h3>
                </div>
              )}
            </div>

            <div className="mt-auto shrink-0 pb-6">
              <button 
                onClick={handleSubmit}
                className="w-full py-4 rounded-2xl font-black flex items-center justify-center transition-transform active:scale-95 shadow-lg bg-gray-900 text-white shadow-gray-900/30"
              >
                <Send size={18} className="mr-2" />
                Submit Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
