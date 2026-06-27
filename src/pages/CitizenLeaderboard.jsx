import { Trophy, Medal, MapPin, ChevronRight, Star } from 'lucide-react';
import clsx from 'clsx';
import { useOutletContext } from 'react-router-dom';

const leaderboard = [
  { rank: 1, name: 'Sarah J.', points: 14500, liters: 450, avatar: 'Aneka', badges: ['Gold Watering Can', 'Early Bird'] },
  { rank: 2, name: 'Mike T.', points: 12200, liters: 380, avatar: 'Felix', badges: ['Silver Watering Can'] },
  { rank: 3, name: 'You', points: 1250, liters: 45, avatar: 'Leo', isYou: true, badges: ['Bronze Watering Can'] },
  { rank: 4, name: 'Elena R.', points: 950, liters: 30, avatar: 'Nala', badges: [] },
  { rank: 5, name: 'James W.', points: 800, liters: 25, avatar: 'Jack', badges: [] },
];

export default function CitizenLeaderboard() {
  const { ecoPoints } = useOutletContext();
  
  // Create a copy and insert our current points for the "You" user
  const currentLeaderboard = leaderboard.map(u => 
    u.isYou ? { ...u, points: ecoPoints } : u
  ).sort((a,b) => b.points - a.points).map((u, i) => ({ ...u, rank: i + 1 }));

  return (
    <div className="min-h-full bg-gray-bg p-6 pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Community</h1>
        <p className="text-gray-500 font-medium">See how you rank against the city.</p>
      </div>

      {/* Neighborhood vs Neighborhood */}
      <div className="bg-gradient-to-br from-earthy-green to-[#2E7D32] rounded-3xl p-5 shadow-lg mb-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10" />
        <h2 className="text-sm font-bold text-white/80 uppercase tracking-wider mb-2">District Rivalry</h2>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-2xl font-black">Downtown</p>
            <p className="text-sm font-medium text-white/80">is winning this week!</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-warning-amber">VS</p>
            <p className="text-sm font-bold">North District</p>
          </div>
        </div>
        <div className="mt-4 bg-black/20 rounded-full h-2 w-full overflow-hidden flex">
          <div className="bg-warning-amber h-full w-[65%]" />
          <div className="bg-white/30 h-full w-[35%]" />
        </div>
        <div className="flex justify-between mt-1 text-[10px] font-bold">
          <span>65% Trees Saved</span>
          <span>35% Trees Saved</span>
        </div>
      </div>

      {/* City Leaderboard */}
      <div className="flex justify-between items-end mb-4">
        <h2 className="text-xl font-black text-gray-800">Top Citizens</h2>
        <span className="text-xs font-bold text-gray-500 uppercase">Weekly</span>
      </div>
      
      <div className="bg-white rounded-3xl shadow-sm border-2 border-gray-100 overflow-hidden">
        {currentLeaderboard.map((user) => (
          <div 
            key={user.rank} 
            className={clsx(
              "flex items-center p-4 border-b border-gray-50 last:border-0",
              user.isYou && "bg-earthy-green/5 relative"
            )}
          >
            {user.isYou && <div className="absolute left-0 top-0 bottom-0 w-1 bg-earthy-green" />}
            
            <div className="w-6 text-center font-black text-gray-400 mr-3">
              {user.rank === 1 ? <Medal className="text-warning-amber inline" size={20} /> : 
               user.rank === 2 ? <Medal className="text-gray-400 inline" size={20} /> : 
               user.rank === 3 ? <Medal className="text-amber-700 inline" size={20} /> : 
               user.rank}
            </div>
            
            <div className="relative">
              <img 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.avatar}`} 
                alt={user.name} 
                className={clsx("w-12 h-12 rounded-full mr-3", user.isYou ? "border-2 border-earthy-green bg-white" : "bg-gray-100")}
              />
              {user.badges.length > 0 && (
                <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm border border-gray-100" title={user.badges.join(', ')}>
                  <Star size={12} className="text-warning-amber fill-warning-amber" />
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h4 className={clsx("font-bold text-sm", user.isYou ? "text-earthy-green" : "text-gray-800")}>
                {user.name}
              </h4>
              <p className="text-[10px] text-gray-500 font-medium">{user.liters}L Poured</p>
            </div>
            
            <div className="text-right">
              <p className="font-black text-sm text-gray-800">{user.points}</p>
              <p className="text-[10px] text-gray-400 uppercase font-bold">pts</p>
            </div>
          </div>
        ))}
        
        <button className="w-full p-4 text-center text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors flex items-center justify-center">
          View Top 100 <ChevronRight size={14} className="ml-1" />
        </button>
      </div>
    </div>
  );
}
