import { Droplet, TreePine, MapPin, Calendar, Activity, ShieldCheck } from 'lucide-react';
import clsx from 'clsx';
import { useOutletContext } from 'react-router-dom';

const history = [
  { id: 1, tree: 'Oak Tree', date: 'Today, 2:30 PM', liters: 5, address: 'Central Park' },
  { id: 2, tree: 'Pine Tree', date: 'Yesterday, 9:15 AM', liters: 3, address: 'North Ave' },
  { id: 3, tree: 'Elm Tree', date: 'Jun 24, 4:00 PM', liters: 4, address: 'Downtown Square' },
];

export default function CitizenProfile() {
  const { ecoPoints } = useOutletContext();
  
  // RPG Level Logic Mockup
  const currentLevel = 5;
  const levelName = "Forest Ranger";
  const pointsToNext = 2000;
  const progressPercent = (ecoPoints / pointsToNext) * 100;

  return (
    <div className="min-h-full bg-gray-bg p-6 pb-24 relative overflow-y-auto">
      
      {/* Header & RPG Status */}
      <div className="flex flex-col items-center mt-4 mb-8">
        <div className="relative mb-4">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Leo" 
            alt="Your Avatar" 
            className="w-24 h-24 rounded-full bg-white border-4 border-earthy-green shadow-lg"
          />
          <div className="absolute -bottom-2 -right-4 bg-gray-900 text-white text-xs font-black px-3 py-1 rounded-full border-2 border-white shadow-sm flex items-center">
            <ShieldCheck size={14} className="mr-1 text-earthy-green" /> Lvl {currentLevel}
          </div>
        </div>
        <h1 className="text-2xl font-black text-gray-800 tracking-tight">{levelName}</h1>
        <p className="text-gray-500 font-medium text-sm mt-1">Eco-Master in {pointsToNext - ecoPoints} pts</p>
        
        {/* XP Bar */}
        <div className="w-full max-w-[200px] mt-3">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-earthy-green transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-2xl bg-water-drop-blue/10 flex items-center justify-center mr-3">
            <Droplet className="text-water-drop-blue fill-water-drop-blue/20" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Poured</p>
            <p className="text-xl font-black text-gray-800">45L</p>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-4 shadow-sm border-2 border-gray-100 flex items-center">
          <div className="w-12 h-12 rounded-2xl bg-earthy-green/10 flex items-center justify-center mr-3">
            <TreePine className="text-earthy-green" size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 uppercase">Saved</p>
            <p className="text-xl font-black text-gray-800">12 Trees</p>
          </div>
        </div>
      </div>

      {/* History Log */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-black text-gray-800 flex items-center">
          <Activity size={18} className="mr-2 text-earthy-green" /> History Log
        </h2>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border-2 border-gray-100 overflow-hidden">
        {history.map((log) => (
          <div key={log.id} className="p-4 border-b border-gray-50 last:border-0 flex items-start">
            <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center mr-3 shrink-0">
              <TreePine size={18} className="text-gray-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gray-800 text-sm leading-tight">{log.tree}</h4>
              <p className="text-[10px] text-gray-500 font-medium flex items-center mt-1">
                <MapPin size={10} className="mr-1" /> {log.address}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-water-drop-blue">+{log.liters}L</p>
              <p className="text-[10px] text-gray-400 font-medium flex items-center justify-end mt-1">
                 {log.date}
              </p>
            </div>
          </div>
        ))}
        
        <button className="w-full p-4 text-center text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors bg-gray-50/50">
          Load More
        </button>
      </div>

    </div>
  );
}
