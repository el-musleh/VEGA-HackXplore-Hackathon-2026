import { useState } from 'react';
import { Trophy, AlertCircle, Megaphone, CheckCircle, Clock } from 'lucide-react';

export default function AdminCommunity() {
  const [pushTitle, setPushTitle] = useState("Heatwave Alert! 🌡️");
  const [pushBody, setPushBody] = useState("Temperatures are spiking this weekend. Trees in the Downtown sector need extra water!");

  const topVolunteers = [
    { rank: 1, name: "Sarah L.", points: 1450, liters: 420, badges: 8 },
    { rank: 2, name: "Max W.", points: 1220, liters: 380, badges: 6 },
    { rank: 3, name: "Elena G.", points: 980, liters: 310, badges: 4 },
    { rank: 4, name: "Tom K.", points: 840, liters: 250, badges: 3 },
    { rank: 5, name: "Julia B.", points: 760, liters: 210, badges: 3 }
  ];

  const issueReports = [
    { id: 1042, user: "Max W.", type: "Vandalism", desc: "Sensor casing broken on Oak tree #412.", status: "Pending", time: "2 hours ago" },
    { id: 1043, user: "Anonymous", type: "Tree Health", desc: "Large branch snapped off Linden tree #882.", status: "In Progress", time: "5 hours ago" },
    { id: 1044, user: "Sarah L.", type: "Water Source", desc: "Public tap near park entrance is leaking.", status: "Resolved", time: "1 day ago" }
  ];

  return (
    <div className="space-y-6 flex flex-col h-full">
      <header className="mb-4">
        <h1 className="text-3xl font-black tracking-tight text-gray-900">Community Hub</h1>
        <p className="text-gray-500 mt-1">Manage citizen engagement, reward volunteers, and handle community-reported issues.</p>
      </header>

      <div className="grid grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Left Column: Leaderboard & Issues */}
        <div className="col-span-8 flex flex-col space-y-6 min-h-0">
          
          {/* Volunteer Leaderboard */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-xl flex flex-col flex-1 min-h-0">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center mr-3">
                <Trophy className="text-amber-500" size={16} />
              </div>
              <h2 className="font-black text-gray-900">Volunteer Leaderboard (This Month)</h2>
            </div>
            
            <div className="overflow-y-auto flex-1 p-0">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase tracking-widest text-gray-400">
                    <th className="px-6 py-3 font-bold">Rank</th>
                    <th className="px-6 py-3 font-bold">Citizen</th>
                    <th className="px-6 py-3 font-bold text-right">Liters Poured</th>
                    <th className="px-6 py-3 font-bold text-right">EcoPoints</th>
                  </tr>
                </thead>
                <tbody>
                  {topVolunteers.map((vol) => (
                    <tr key={vol.rank} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                          vol.rank === 1 ? 'bg-amber-100 text-amber-600' :
                          vol.rank === 2 ? 'bg-gray-200 text-gray-600' :
                          vol.rank === 3 ? 'bg-orange-100 text-orange-700' : 'bg-gray-50 text-gray-400'
                        }`}>
                          #{vol.rank}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">{vol.name}</p>
                        <p className="text-xs text-gray-500">{vol.badges} Badges Earned</p>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-water-drop-blue">
                        {vol.liters} L
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="bg-earthy-green/10 text-earthy-green font-black px-3 py-1.5 rounded-lg text-sm">
                          {vol.points} EP
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Issue Reports */}
          <div className="bg-white border border-gray-100 rounded-3xl shadow-xl flex flex-col flex-1 min-h-0">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center mr-3">
                <AlertCircle className="text-red-500" size={16} />
              </div>
              <h2 className="font-black text-gray-900">Citizen Issue Reports</h2>
            </div>
            
            <div className="overflow-y-auto flex-1 p-4 space-y-3">
              {issueReports.map((report) => (
                <div key={report.id} className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex justify-between items-start">
                  <div>
                    <div className="flex items-center mb-1">
                      <span className="text-xs font-bold text-gray-500 bg-gray-200 px-2 py-0.5 rounded mr-2">#{report.id}</span>
                      <h3 className="font-bold text-gray-900 text-sm">{report.type}</h3>
                    </div>
                    <p className="text-gray-600 text-sm mt-1">{report.desc}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-2">Reported by {report.user} • {report.time}</p>
                  </div>
                  <div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center ${
                      report.status === 'Pending' ? 'bg-red-50 text-red-600 border border-red-100' :
                      report.status === 'In Progress' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                      'bg-earthy-green/10 text-earthy-green border border-earthy-green/20'
                    }`}>
                      {report.status === 'Resolved' ? <CheckCircle size={12} className="mr-1" /> : <Clock size={12} className="mr-1" />}
                      {report.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Column: Broadcast Push Notifications */}
        <div className="col-span-4 bg-gray-900 rounded-3xl shadow-xl border border-gray-800 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <Megaphone size={150} className="text-white" />
          </div>
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center mr-3 border border-blue-500/30">
                <Megaphone className="text-blue-400" size={20} />
              </div>
              <h2 className="font-black text-white text-lg">Broadcast Push</h2>
            </div>
            
            <p className="text-gray-400 text-sm mb-6">Send urgent push notifications directly to all Citizen App users in the city.</p>
            
            <div className="space-y-4 flex-1">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Notification Title</label>
                <input 
                  type="text" 
                  value={pushTitle}
                  onChange={(e) => setPushTitle(e.target.value)}
                  className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message Body</label>
                <textarea 
                  value={pushBody}
                  onChange={(e) => setPushBody(e.target.value)}
                  rows={4}
                  className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Target District</label>
                <select className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none">
                  <option>All Districts (City-wide)</option>
                  <option>Innenstadt-Ost</option>
                  <option>Südstadt</option>
                  <option>Durlach</option>
                </select>
              </div>
            </div>
            
            <button 
              onClick={() => alert(`Push Notification Sent to Citizens:\n\n${pushTitle}\n${pushBody}`)}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-xl mt-6 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-colors active:scale-95"
            >
              Send Broadcast
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
