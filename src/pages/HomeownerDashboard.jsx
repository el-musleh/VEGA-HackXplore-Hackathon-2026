import { useState } from 'react';
import { Droplet, Plus, X, Globe, Lock } from 'lucide-react';
import clsx from 'clsx';

const speciesDB = [
  { name: 'Fern', emoji: '🌿', threshold: 30 },
  { name: 'Basil', emoji: '🌱', threshold: 40 },
  { name: 'Cactus', emoji: '🌵', threshold: 15 },
  { name: 'Monstera', emoji: '🪴', threshold: 35 },
  { name: 'Bonsai', emoji: '🌲', threshold: 25 },
];

const mockPlants = [
  { id: 1, name: 'Living Room Fern', emoji: '🌿', moisture: 78, threshold: 30, isPublic: false },
  { id: 2, name: 'Kitchen Basil', emoji: '🌱', moisture: 22, threshold: 40, isPublic: false }, 
  { id: 3, name: 'Office Cactus', emoji: '🌵', moisture: 45, threshold: 15, isPublic: false },
  { id: 4, name: 'Balcony Monstera', emoji: '🪴', moisture: 28, threshold: 35, isPublic: true }, // Shared!
];

export default function HomeownerDashboard() {
  const [plants, setPlants] = useState(mockPlants);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newPlantName, setNewPlantName] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState(speciesDB[0]);
  const [isPubliclyShared, setIsPubliclyShared] = useState(false);
  
  const plantsNeedingAttention = plants.filter(p => p.moisture < p.threshold).length;

  const handleWater = (id) => {
    setPlants(plants.map(p => p.id === id ? { ...p, moisture: 100 } : p));
  };

  const togglePublicStatus = (id) => {
    setPlants(plants.map(p => p.id === id ? { ...p, isPublic: !p.isPublic } : p));
  };

  const handleAddPlant = (e) => {
    e.preventDefault();
    if (!newPlantName) return;
    
    const newPlant = {
      id: Date.now(),
      name: newPlantName,
      emoji: selectedSpecies.emoji,
      threshold: selectedSpecies.threshold,
      moisture: Math.floor(Math.random() * 60) + 40, 
      isPublic: isPubliclyShared
    };
    
    setPlants([...plants, newPlant]);
    setIsModalOpen(false);
    setNewPlantName('');
    setSelectedSpecies(speciesDB[0]);
    setIsPubliclyShared(false);
  };

  return (
    <div className="min-h-full bg-gray-bg p-6 pb-20 relative">
      {/* Header */}
      <div className="mb-8 mt-2 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Good Morning! ☀️</h1>
          <p className="text-gray-500 font-medium mt-1">
            {plantsNeedingAttention === 0 
              ? 'All your plants are perfectly hydrated.'
              : `${plantsNeedingAttention} of your plants need attention.`}
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="w-12 h-12 bg-water-drop-blue text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0 ml-4"
        >
          <Plus size={24} strokeWidth={3} />
        </button>
      </div>

      {/* Grid of Plant Cards */}
      <div className="grid grid-cols-2 gap-4">
        {plants.map((plant) => {
          const needsWater = plant.moisture < plant.threshold;
          
          return (
            <div 
              key={plant.id} 
              className={clsx(
                "relative bg-white rounded-3xl p-4 shadow-sm border-2 transition-all duration-300 flex flex-col items-center text-center",
                needsWater ? "border-warning-red/30 bg-red-50/30" : "border-transparent"
              )}
            >
              {/* Public Indicator */}
              <button 
                onClick={() => togglePublicStatus(plant.id)}
                className={clsx(
                  "absolute top-3 left-3 p-1.5 rounded-full transition-colors",
                  plant.isPublic ? "bg-earthy-green/10 text-earthy-green" : "bg-gray-100 text-gray-400"
                )}
                title={plant.isPublic ? "Shared to Public Map" : "Private"}
              >
                {plant.isPublic ? <Globe size={14} /> : <Lock size={14} />}
              </button>

              {/* Needs water indicator badge */}
              {needsWater && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-warning-red rounded-full shadow-sm flex items-center justify-center animate-bounce">
                  <Droplet size={12} className="text-white fill-white" />
                </div>
              )}

              <div className="text-5xl mb-2 mt-4">{plant.emoji}</div>
              <h3 className="font-bold text-sm text-gray-800 leading-tight mb-2 h-8 flex items-center justify-center">{plant.name}</h3>
              
              {/* Circular Progress Bar approximation */}
              <div className="relative w-14 h-14 flex items-center justify-center mb-3">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-gray-100"
                    strokeWidth="3"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={needsWater ? "text-warning-red" : "text-earthy-green"}
                    strokeWidth="3"
                    strokeDasharray={`${plant.moisture}, 100`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className={clsx("text-xs font-black", needsWater ? "text-warning-red" : "text-gray-700")}>
                    {plant.moisture}%
                  </span>
                </div>
              </div>

              {needsWater ? (
                <button 
                  onClick={() => handleWater(plant.id)}
                  className="w-full py-2 bg-water-drop-blue text-white rounded-xl font-bold text-xs shadow-[0_4px_12px_rgba(3,169,244,0.3)] active:scale-95 transition-transform"
                >
                  Water Now
                </button>
              ) : (
                <div className="w-full py-2 bg-gray-50 text-earthy-green rounded-xl font-bold text-xs">
                  Healthy
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Plant Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[500] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in-down">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-gray-800">Add New Sensor</h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 bg-gray-100 rounded-full text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddPlant} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Plant Nickname</label>
                <input 
                  type="text" 
                  required
                  value={newPlantName}
                  onChange={e => setNewPlantName(e.target.value)}
                  placeholder="e.g. Living Room Fern"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-water-drop-blue focus:outline-none transition-colors text-gray-800 font-medium"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Plant Species</label>
                <div className="grid grid-cols-3 gap-2">
                  {speciesDB.map(species => (
                    <button
                      key={species.name}
                      type="button"
                      onClick={() => setSelectedSpecies(species)}
                      className={clsx(
                        "p-2 rounded-xl border-2 flex flex-col items-center justify-center transition-colors",
                        selectedSpecies.name === species.name 
                          ? "border-earthy-green bg-earthy-green/10" 
                          : "border-gray-100 bg-white hover:border-gray-200"
                      )}
                    >
                      <span className="text-xl mb-1">{species.emoji}</span>
                      <span className="font-bold text-[10px] text-gray-700">{species.name}</span>
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Selected threshold: <span className="font-bold text-water-drop-blue">{selectedSpecies.threshold}%</span> moisture.
                </p>
              </div>

              {/* Share to Public Map Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl mt-4">
                <div>
                  <h4 className="font-bold text-sm text-gray-800 flex items-center">
                    <Globe size={16} className="text-earthy-green mr-2" /> Share to Public Map
                  </h4>
                  <p className="text-[10px] text-gray-500 mt-1">Allow neighbors to water this plant</p>
                </div>
                <button 
                  type="button"
                  onClick={() => setIsPubliclyShared(!isPubliclyShared)}
                  className={clsx(
                    "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none",
                    isPubliclyShared ? "bg-earthy-green" : "bg-gray-200"
                  )}
                >
                  <span
                    className={clsx(
                      "inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-300",
                      isPubliclyShared ? "translate-x-6" : "translate-x-1"
                    )}
                  />
                </button>
              </div>

              <button 
                type="submit" 
                className="w-full mt-4 py-4 bg-gray-900 text-white rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
              >
                Sync ESP32 Sensor
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
