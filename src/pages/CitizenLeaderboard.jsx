import { Trophy, Medal, MapPin } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';

export default function CitizenLeaderboard() {
  const { ecoPoints } = useOutletContext();
  
  // Mock leaderboard data incorporating the user's reactive points
  const leaderboard = [
    { rank: 1, name: "Sarah K.", points: 3420, avatar: "SK", neighborhood: "Innenstadt-West" },
    { rank: 2, name: "Markus V.", points: 2850, avatar: "MV", neighborhood: "Innenstadt-West" },
    { rank: 3, name: "Elena R.", points: 2100, avatar: "ER", neighborhood: "Oststadt" },
    { rank: 4, name: "Alex (You)", points: ecoPoints, avatar: "AL", isUser: true, neighborhood: "Innenstadt-West" },
    { rank: 5, name: "David M.", points: 1100, avatar: "DM", neighborhood: "Südstadt" },
    { rank: 6, name: "Lisa T.", points: 950, avatar: "LT", neighborhood: "Innenstadt-West" },
  ].sort((a, b) => b.points - a.points).map((user, idx) => ({ ...user, rank: idx + 1 }));

  return (
    <div className="min-h-full bg-gray-bg flex flex-col pb-8">
      
      {/* Header */}
      <header className="bg-gray-900 p-6 rounded-b-[40px] shadow-xl border-b border-gray-800 shrink-0 relative overflow-hidden">
        <div className="absolute -right-4 -top-4 opacity-10">
          <Trophy size={120} className="text-white" />
        </div>
        
        <div className="relative z-10 pt-2 pb-6">
          <div className="flex items-center text-gray-400 mb-2">
            <MapPin size={14} className="mr-1" />
            <span className="text-xs font-bold uppercase tracking-widest">Innenstadt-West</span>
          </div>
          <h1 className="text-3xl font-black text-white">Neighborhood<br/>Ranks</h1>
          
          <div className="mt-6 bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Rank</p>
              <p className="text-2xl font-black text-white">#{leaderboard.find(u => u.isUser).rank}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Your Points</p>
              <p className="text-2xl font-black text-earthy-green">{ecoPoints}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Leaderboard List */}
      <div className="flex-1 px-6 pt-6 overflow-y-auto">
        <div className="space-y-3">
          {leaderboard.map((user) => (
            <div 
              key={user.name}
              className={`p-4 rounded-3xl flex items-center justify-between transition-all ${
                user.isUser 
                  ? 'bg-earthy-green shadow-lg shadow-earthy-green/20 scale-[1.02] -mx-2 px-6' 
                  : 'bg-white shadow-sm border border-gray-100'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black mr-4 shrink-0 ${
                  user.rank === 1 ? 'bg-yellow-100 text-yellow-600' :
                  user.rank === 2 ? 'bg-gray-200 text-gray-600' :
                  user.rank === 3 ? 'bg-orange-100 text-orange-600' :
                  user.isUser ? 'bg-white/20 text-white' :
                  'bg-gray-50 text-gray-400'
                }`}>
                  {user.rank <= 3 ? <Medal size={16} /> : user.rank}
                </div>
                
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-black text-lg mr-4 shrink-0 shadow-inner ${
                  user.isUser ? 'bg-white text-earthy-green' : 'bg-gray-100 text-gray-500'
                }`}>
                  {user.avatar}
                </div>

                <div>
                  <p className={`font-bold ${user.isUser ? 'text-white text-lg' : 'text-gray-900'}`}>
                    {user.name}
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest mt-0.5 ${user.isUser ? 'text-green-100' : 'text-gray-400'}`}>
                    {user.neighborhood}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className={`font-black ${user.isUser ? 'text-white text-xl' : 'text-earthy-green text-lg'}`}>
                  {user.points}
                </p>
                <p className={`text-[10px] font-bold uppercase tracking-widest ${user.isUser ? 'text-green-100' : 'text-gray-400'}`}>
                  pts
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
