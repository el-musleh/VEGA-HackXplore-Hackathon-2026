import { Coffee, Ticket, TreePine, ExternalLink } from 'lucide-react';
import clsx from 'clsx';
import { useOutletContext } from 'react-router-dom';

const rewards = [
  { id: 1, title: 'Free Coffee', sponsor: 'Local Beans Cafe', points: 500, icon: Coffee, color: 'text-amber-700', bg: 'bg-amber-100' },
  { id: 2, title: '1-Day Bus Pass', sponsor: 'City Transit', points: 1000, icon: Ticket, color: 'text-blue-600', bg: 'bg-blue-100' },
  { id: 3, title: 'Plant a REAL Tree', sponsor: 'City Parks Dept', points: 2000, icon: TreePine, color: 'text-earthy-green', bg: 'bg-earthy-green/20' },
];

export default function CitizenRewards() {
  const { ecoPoints, setEcoPoints } = useOutletContext();

  const handleRedeem = (points) => {
    if (ecoPoints >= points) {
      alert("Reward Redeemed! You will receive an email with your QR coupon.");
      setEcoPoints(prev => prev - points);
    } else {
      alert("Not enough Eco-Points!");
    }
  };

  return (
    <div className="min-h-full bg-gray-bg p-6 pb-24">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Rewards</h1>
        <p className="text-gray-500 font-medium">Redeem your hard-earned points.</p>
      </div>

      <div className="bg-gray-900 rounded-3xl p-6 mb-8 text-white shadow-lg flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Available Balance</p>
          <p className="text-4xl font-black text-earthy-green">{ecoPoints}</p>
        </div>
        <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center">
          <TreePine size={32} className="text-earthy-green" />
        </div>
      </div>

      <div className="space-y-4">
        {rewards.map((reward) => {
          const canAfford = ecoPoints >= reward.points;
          return (
            <div key={reward.id} className="bg-white rounded-3xl p-5 shadow-sm border-2 border-gray-100 relative overflow-hidden group">
              <div className="flex items-center mb-4">
                <div className={clsx("w-12 h-12 rounded-xl flex items-center justify-center mr-4", reward.bg)}>
                  <reward.icon className={reward.color} size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{reward.title}</h3>
                  <p className="text-xs text-gray-500 font-medium">{reward.sponsor}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-lg text-gray-800">{reward.points}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">pts</p>
                </div>
              </div>
              
              <button 
                onClick={() => handleRedeem(reward.points)}
                disabled={!canAfford}
                className={clsx(
                  "w-full py-3 rounded-xl text-sm font-bold shadow-sm transition-all flex items-center justify-center",
                  canAfford 
                    ? "bg-earthy-green text-white hover:bg-[#388E3C] active:scale-95" 
                    : "bg-gray-100 text-gray-400 cursor-not-allowed"
                )}
              >
                {canAfford ? 'Redeem Reward' : `Need ${reward.points - ecoPoints} more pts`}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 text-center">
        <a href="#" className="text-xs font-bold text-gray-400 flex items-center justify-center hover:text-gray-600">
          Suggest a Reward <ExternalLink size={12} className="ml-1" />
        </a>
      </div>
    </div>
  );
}
