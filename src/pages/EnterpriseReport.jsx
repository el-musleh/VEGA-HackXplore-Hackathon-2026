import { useState } from 'react';
import { FileWarning, Camera, AlertTriangle, Hammer, Sprout, Send, ImagePlus, X } from 'lucide-react';

export default function EnterpriseReport() {
  const [selectedIssue, setSelectedIssue] = useState(null);
  const [hasPhoto, setHasPhoto] = useState(false);
  const [notes, setNotes] = useState("");

  const issueTypes = [
    { id: 'vandalism', icon: Hammer, label: "Sensor Vandalized", desc: "Physical damage to hardware" },
    { id: 'diseased', icon: Sprout, label: "Tree Diseased/Dead", desc: "Visual signs of decay or death" },
    { id: 'soil', icon: AlertTriangle, label: "Soil Compacted", desc: "Water won't absorb into roots" }
  ];

  const handleCameraClick = () => {
    // Mock opening camera and snapping photo
    setHasPhoto(true);
  };

  const handleSubmit = () => {
    if (!selectedIssue) return;
    
    alert(`Report Submitted Successfully!\n\nIssue: ${selectedIssue}\nPhoto Attached: ${hasPhoto ? 'Yes' : 'No'}\nNotes: ${notes || 'None'}`);
    
    // Reset form
    setSelectedIssue(null);
    setHasPhoto(false);
    setNotes("");
  };

  return (
    <div className="min-h-full bg-gray-bg flex flex-col">
      <header className="p-6 bg-white border-b border-gray-100 shrink-0">
        <h1 className="text-2xl font-black tracking-tight text-gray-900">Issue Reporting</h1>
        <p className="text-gray-500 mt-1 text-sm font-medium">Log visual problems the IoT sensors cannot detect.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-6 flex flex-col">
        
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Issue Category</h2>
        <div className="grid gap-3 mb-8 shrink-0">
          {issueTypes.map((type) => (
            <div 
              key={type.id}
              onClick={() => setSelectedIssue(type.label)}
              className={`p-4 rounded-2xl border-2 flex items-center cursor-pointer transition-all ${
                selectedIssue === type.label 
                  ? 'border-gray-900 bg-gray-50 shadow-sm' 
                  : 'border-transparent bg-white shadow-sm hover:border-gray-200'
              }`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mr-4 transition-colors ${
                selectedIssue === type.label ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500'
              }`}>
                <type.icon size={24} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">{type.label}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{type.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {selectedIssue && (
          <div className="animate-in slide-in-from-bottom-4 flex-1 flex flex-col">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Provide Evidence</h2>
            
            {/* Mock Camera/Photo UI */}
            <div className="bg-white p-2 rounded-3xl shadow-sm border border-gray-100 mb-6 shrink-0">
              {hasPhoto ? (
                <div className="relative h-48 bg-gray-900 rounded-2xl overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-40 bg-[url('https://images.unsplash.com/photo-1596767554902-1811eef2a912?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
                  <CheckCircle size={48} className="text-earthy-green relative z-10" />
                  <button 
                    onClick={() => setHasPhoto(false)}
                    className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white hover:bg-black/70 backdrop-blur-md"
                  >
                    <X size={16} />
                  </button>
                  <p className="absolute bottom-3 left-4 text-white text-xs font-bold tracking-widest uppercase relative z-10">
                    Evidence_IMG_041.jpg
                  </p>
                </div>
              ) : (
                <div 
                  onClick={handleCameraClick}
                  className="h-48 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors"
                >
                  <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-3">
                    <Camera size={24} />
                  </div>
                  <h3 className="font-bold text-gray-900">Take a Photo</h3>
                  <p className="text-xs text-gray-500 mt-1">Required for government tickets</p>
                </div>
              )}
            </div>

            <div className="mb-8 shrink-0">
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Additional Notes (Optional)</label>
              <textarea 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                placeholder="Describe the extent of the damage..."
                className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-shadow resize-none shadow-sm"
              />
            </div>

            <div className="mt-auto shrink-0 pb-6">
              <button 
                onClick={handleSubmit}
                disabled={!hasPhoto}
                className={`w-full py-4 rounded-2xl font-black flex items-center justify-center transition-all shadow-lg ${
                  hasPhoto 
                    ? 'bg-gray-900 text-white shadow-gray-900/30 hover:bg-gray-800 active:scale-95' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                }`}
              >
                <Send size={18} className="mr-2" />
                Submit to Dispatch
              </button>
              {!hasPhoto && (
                <p className="text-center text-[10px] text-gray-400 font-bold mt-3 uppercase tracking-widest">
                  Photo evidence is required to submit
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
