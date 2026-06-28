import { useState, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import DeckGL from '@deck.gl/react';
import { TextLayer, ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Droplet, MapPin, Wifi, X, Trees, Navigation, Filter, Lock, Unlock, Zap, Droplets, BatteryLow, BatteryMedium, BatteryFull, History } from 'lucide-react';

// Generate deterministic mock LoRaWAN history for a tree
function generateHistory(treeId, currentMoisture) {
  const now = Date.now();
  const entries = [];
  // Seed based on treeId so it's stable per tree
  let val = currentMoisture;
  for (let i = 11; i >= 0; i--) {
    const ts = now - i * 6 * 60 * 60 * 1000; // every 6 hours
    // Drift value slightly each step
    const delta = ((treeId * 7 + i * 13) % 15) - 7;
    val = Math.max(5, Math.min(95, val + delta));
    entries.push({ ts, moisture: Math.round(val) });
  }
  // Last entry is always current
  entries[entries.length - 1].moisture = currentMoisture;
  return entries;
}

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

const INITIAL_VIEW_STATE = {
  longitude: 8.4037,
  latitude: 49.0069,
  zoom: 12,
  pitch: 60,
  bearing: -20
};

// Mock Public Water Sources (Hydrants/Taps)
const WATER_SOURCES = [
  { pos: [49.0069, 8.4037] },
  { pos: [49.01, 8.39] },
  { pos: [49.005, 8.41] },
  { pos: [49.015, 8.42] },
  { pos: [49.02, 8.38] }
];

export default function AdminMap() {
  const { trees } = useOutletContext();
  const [hoverInfo, setHoverInfo] = useState(null);
  const [clickedInfo, setClickedInfo] = useState(null);
  
  // Filters State
  const [showWaterSources, setShowWaterSources] = useState(true);
  const [urgencyFilter, setUrgencyFilter] = useState('all'); // all, critical, warning, healthy
  const [batteryFilter, setBatteryFilter] = useState(false); // only show < 15% battery

  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // We mock the "isPrivate" state locally for the hackathon UI demo
  const [privateTrees, setPrivateTrees] = useState(new Set());

  const togglePrivate = (treeId) => {
    const newSet = new Set(privateTrees);
    if (newSet.has(treeId)) newSet.delete(treeId);
    else newSet.add(treeId);
    setPrivateTrees(newSet);
  };

  const filteredTrees = useMemo(() => {
    return trees.filter(t => {
      // Urgency Filter
      if (urgencyFilter === 'critical' && t.moisture >= 20) return false;
      if (urgencyFilter === 'warning' && (t.moisture < 20 || t.moisture > 40)) return false;
      if (urgencyFilter === 'healthy' && t.moisture <= 40) return false;
      
      // Mock Battery Filter (every 5th tree has low battery)
      if (batteryFilter && t.id % 5 !== 0) return false;

      return true;
    });
  }, [trees, urgencyFilter, batteryFilter]);

  const layers = [
    new ScatterplotLayer({
      id: 'tree-base-circles',
      data: filteredTrees,
      getPosition: d => [d.pos[1], d.pos[0]],
      getFillColor: d => {
        if (d.moisture < 20) return [239, 68, 68, 200]; // Red
        if (d.moisture < 40) return [245, 158, 11, 200]; // Orange
        return [34, 197, 94, 200]; // Green
      },
      getLineColor: [255, 255, 255],
      lineWidthMinPixels: 2,
      getRadius: 30,
      pickable: true,
      onHover: info => setHoverInfo(info),
      onClick: info => setClickedInfo(info)
    }),
    new TextLayer({
      id: 'tree-icons',
      data: filteredTrees,
      getPosition: d => [d.pos[1], d.pos[0], 0], 
      getText: d => (d.type && (d.type.includes('Tanne') || d.type.includes('Fichte') || d.type.includes('Kiefer'))) ? '🌲' : '🌳',
      getSize: 15,
      sizeScale: 1,
      sizeUnits: 'meters',
      getColor: d => {
        if (d.moisture < 20) return [239, 68, 68, 255];
        if (d.moisture < 40) return [245, 158, 11, 255];
        return [34, 197, 94, 255];
      },
      getTextAnchor: 'middle',
      getAlignmentBaseline: 'bottom',
      characterSet: ['🌲', '🌳'],
      billboard: true
    }),
    ...(showWaterSources ? [
      new ScatterplotLayer({
        id: 'water-sources',
        data: WATER_SOURCES,
        getPosition: d => [d.pos[1], d.pos[0]],
        getFillColor: [59, 130, 246, 255], // Blue
        getLineColor: [255, 255, 255],
        lineWidthMinPixels: 2,
        getRadius: 40,
      }),
      new TextLayer({
        id: 'water-sources-icons',
        data: WATER_SOURCES,
        getPosition: d => [d.pos[1], d.pos[0], 0],
        getText: d => '🚰',
        getSize: 20,
        sizeScale: 1,
        sizeUnits: 'meters',
        billboard: true
      })
    ] : [])
  ];

  const onMapLoad = useCallback((e) => {
    const map = e.target;
    if (!map.getLayer('3d-buildings')) {
      map.addLayer({
        'id': '3d-buildings',
        'source': 'carto',
        'source-layer': 'building',
        'type': 'fill-extrusion',
        'minzoom': 14,
        'paint': {
          'fill-extrusion-color': '#e5e7eb',
          'fill-extrusion-height': ['coalesce', ['get', 'render_height'], ['get', 'height'], 15],
          'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], ['get', 'min_height'], 0],
          'fill-extrusion-opacity': 0.8
        }
      });
    }
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* Floating Header + Filters Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between gap-4 pointer-events-none">

        {/* Title Card */}
        <div className="pointer-events-auto flex items-center gap-4 bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl px-5 py-3">
          {/* Live Pulse Indicator */}
          <div className="relative flex items-center justify-center">
            <span className="absolute inline-flex h-3 w-3 rounded-full bg-earthy-green opacity-60 animate-ping" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-earthy-green" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-gray-900 leading-none">GIS Live Map</h1>
            <p className="text-gray-400 text-xs mt-0.5 font-medium">Real-time telemetry & overlays</p>
          </div>
          {/* Tree Count Badge */}
          <div className="ml-2 bg-gray-100 border border-gray-200 rounded-xl px-3 py-1.5 flex items-center gap-1.5">
            <Trees size={13} className="text-earthy-green" />
            <span className="text-xs font-black text-gray-700">{filteredTrees.length} trees</span>
          </div>
        </div>

        {/* Filters Toolbar */}
        <div className="pointer-events-auto flex items-center gap-2 bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-2xl px-3 py-2">
          {/* Urgency segment */}
          <div className="flex bg-gray-100 rounded-xl p-1 gap-0.5">
            <button onClick={() => setUrgencyFilter('all')} className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${urgencyFilter==='all' ? 'bg-gray-900 text-white shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>All</button>
            <button onClick={() => setUrgencyFilter('critical')} className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${urgencyFilter==='critical' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:text-red-600'}`}>Critical</button>
            <button onClick={() => setUrgencyFilter('warning')} className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all ${urgencyFilter==='warning' ? 'bg-amber-500 text-white shadow-sm' : 'text-gray-500 hover:text-amber-600'}`}>Warning</button>
          </div>

          <div className="w-px h-5 bg-gray-200 mx-1" />

          <button
            onClick={() => setBatteryFilter(!batteryFilter)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${batteryFilter ? 'bg-orange-100 border-orange-200 text-orange-700' : 'text-gray-500 border-transparent hover:bg-gray-100'}`}
          >
            <Zap size={13} /> Low Battery
          </button>

          <button
            onClick={() => setShowWaterSources(!showWaterSources)}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all ${showWaterSources ? 'bg-blue-100 border-blue-200 text-blue-700' : 'text-gray-500 border-transparent hover:bg-gray-100'}`}
          >
            <Droplets size={13} /> Public Taps
          </button>
        </div>
      </div>

      {/* Full-bleed Map */}
      <DeckGL
        initialViewState={INITIAL_VIEW_STATE}
        controller={true}
        layers={layers}
        style={{ width: '100%', height: '100%' }}
      >
        <Map
          mapLib={maplibregl}
          mapStyle={MAP_STYLE}
          onLoad={onMapLoad}
        />
      </DeckGL>



        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-2xl border border-gray-100 min-w-[200px]">
          <h3 className="font-black text-gray-900 mb-4 text-sm uppercase tracking-widest">Telemetry Legend</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-earthy-green mr-3 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
              <span className="text-sm font-bold text-gray-600">Healthy (&gt;40%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-3 shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
              <span className="text-sm font-bold text-gray-600">Warning (20-40%)</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-3 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
              <span className="text-sm font-bold text-gray-600">Critical (&lt;20%)</span>
            </div>
            <div className="flex items-center pt-2 border-t border-gray-100 mt-2">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-3 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
              <span className="text-sm font-bold text-gray-600">Water Source</span>
            </div>
          </div>
        </div>

        {/* Hover Tooltip */}
        {hoverInfo && hoverInfo.object && !clickedInfo && (
          <div 
            className="absolute z-10 pointer-events-none bg-black/90 backdrop-blur-md text-white px-4 py-3 rounded-xl shadow-2xl transform -translate-x-1/2 -translate-y-full border border-white/10"
            style={{ left: hoverInfo.x, top: hoverInfo.y - 15 }}
          >
            <div className="flex items-center mb-1">
              <Trees size={14} className="text-earthy-green mr-2" />
              <span className="font-black text-sm">{hoverInfo.object.name}</span>
            </div>
            <p className="text-[10px] text-gray-400 font-bold tracking-wider">{hoverInfo.object.stadtteil}</p>
            <div className="mt-2 pt-2 border-t border-white/10 flex justify-between items-center space-x-4">
              <span className="text-xs font-bold text-gray-300">Moisture</span>
              <span className={`text-sm font-black ${hoverInfo.object.moisture < 20 ? 'text-red-400' : hoverInfo.object.moisture < 40 ? 'text-amber-400' : 'text-earthy-green'}`}>
                {hoverInfo.object.moisture}%
              </span>
            </div>
          </div>
        )}

        {/* Clicked Details Panel */}
        {clickedInfo && clickedInfo.object && (
          <div className="absolute top-[96px] right-6 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in slide-in-from-right-8 flex flex-col max-h-[calc(100vh-120px)]">
            <div className="bg-gray-900 p-6 relative">
              <button 
                onClick={() => setClickedInfo(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors bg-white/10 p-1.5 rounded-full"
              >
                <X size={16} />
              </button>
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4">
                <Trees className="text-white" size={24} />
              </div>
              <h2 className="text-xl font-black text-white leading-tight">{clickedInfo.object.name}</h2>
              <p className="text-gray-400 text-xs font-bold tracking-widest uppercase mt-1">ID: {clickedInfo.object.id} • {clickedInfo.object.stadtteil}</p>
            </div>
            
            <div className="p-6 space-y-5 overflow-y-auto flex-1">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">Current Moisture</p>
                <div className="flex items-end">
                  <span className={`text-4xl font-black leading-none ${clickedInfo.object.moisture < 20 ? 'text-red-500' : clickedInfo.object.moisture < 40 ? 'text-amber-500' : 'text-earthy-green'}`}>
                    {clickedInfo.object.moisture}%
                  </span>
                </div>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Sensor Status</p>
                <div className="flex items-center text-sm font-bold text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <Wifi size={16} className="text-earthy-green mr-3" />
                  Online & Active
                </div>
              </div>

              {/* Battery Status */}
              {(() => {
                const battPct = clickedInfo.object.id % 5 === 0 ? 9
                  : clickedInfo.object.id % 3 === 0 ? 42
                  : 78;
                const isLow = battPct < 20;
                const isMed = battPct < 50;
                const BattIcon = isLow ? BatteryLow : isMed ? BatteryMedium : BatteryFull;
                const battColor = isLow ? 'text-red-500' : isMed ? 'text-amber-500' : 'text-earthy-green';
                const barColor = isLow ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-earthy-green';
                const bgColor = isLow ? 'bg-red-50 border-red-100' : isMed ? 'bg-amber-50 border-amber-100' : 'bg-green-50 border-green-100';
                return (
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-2">Battery</p>
                    <div className={`flex items-center gap-3 p-3 rounded-xl border ${bgColor}`}>
                      <BattIcon size={18} className={battColor} />
                      <div className="flex-1">
                        <div className="flex justify-between items-center mb-1">
                          <span className={`text-xs font-black ${battColor}`}>{battPct}%</span>
                          {isLow && <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">Replace Soon</span>}
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${battPct}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* History Button */}
              <div className="pt-2 border-t border-gray-100">
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 bg-gray-900 text-white hover:bg-gray-800 transition-colors"
                >
                  <History size={15} />
                  History
                </button>
              </div>

              <div className="pt-2 border-t border-gray-100">
                <p className="text-sm text-gray-600 font-medium italic">
                  "{clickedInfo.object.fact}"
                </p>
              </div>

              <div className="pt-2">
                <button 
                  onClick={() => togglePrivate(clickedInfo.object.id)}
                  className={`w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center transition-colors ${privateTrees.has(clickedInfo.object.id) ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {privateTrees.has(clickedInfo.object.id) ? (
                    <><Lock size={16} className="mr-2" /> Private (Driver Only)</>
                  ) : (
                    <><Unlock size={16} className="mr-2" /> Public (Citizens Can Water)</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* History Modal Overlay */}
        {showHistoryModal && clickedInfo && clickedInfo.object && (() => {
          const tree = clickedInfo.object;
          const history = generateHistory(tree.id, tree.moisture);
          const fmt = (ts) => {
            const d = new Date(ts);
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) + '  ' +
              d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
          };
          return (
            <div
              className="absolute inset-0 z-30 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
              onClick={() => setShowHistoryModal(false)}
            >
              <div
                className="bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-6 overflow-hidden flex flex-col max-h-[80vh]"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="bg-gray-900 px-7 py-5 flex items-center justify-between flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/10 rounded-2xl flex items-center justify-center">
                      <History size={20} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-white font-black text-lg leading-none">{tree.name}</h2>
                      <p className="text-gray-400 text-xs mt-1 font-bold uppercase tracking-widest">Moisture History · ID {tree.id} · {tree.stadtteil}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowHistoryModal(false)}
                    className="text-gray-400 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Summary bar */}
                <div className="px-7 py-4 bg-gray-50 border-b border-gray-100 flex gap-6 flex-shrink-0">
                  {[['Dry readings', history.filter(h => h.moisture < 20).length, 'text-red-500'],
                    ['Low readings', history.filter(h => h.moisture >= 20 && h.moisture < 40).length, 'text-amber-500'],
                    ['Healthy readings', history.filter(h => h.moisture >= 40).length, 'text-earthy-green']
                  ].map(([label, count, color]) => (
                    <div key={label}>
                      <p className={`text-2xl font-black ${color}`}>{count}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{label}</p>
                    </div>
                  ))}
                  <div className="ml-auto text-right">
                    <p className="text-2xl font-black text-gray-900">{tree.moisture}%</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Current</p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="overflow-y-auto flex-1 px-7 py-5">
                  <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-4">LoRaWAN Readings — Last 3 Days (every 6h)</p>
                  <div className="space-y-3">
                    {[...history].reverse().map((entry, i) => {
                      const isDry = entry.moisture < 20;
                      const isWarn = entry.moisture < 40;
                      const barColor = isDry ? 'bg-red-500' : isWarn ? 'bg-amber-400' : 'bg-earthy-green';
                      const label = isDry ? 'Dry' : isWarn ? 'Low' : 'OK';
                      const labelColor = isDry ? 'text-red-500' : isWarn ? 'text-amber-500' : 'text-earthy-green';
                      const isLatest = i === 0;
                      return (
                        <div key={i} className={`rounded-2xl p-4 border ${
                          isLatest ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-100'
                        }`}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              {isLatest && (
                                <span className="inline-flex items-center gap-1 bg-earthy-green/10 text-earthy-green text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                                  <span className="w-1.5 h-1.5 rounded-full bg-earthy-green inline-block" />
                                  Latest
                                </span>
                              )}
                              <span className="text-xs font-bold text-gray-500">{fmt(entry.ts)}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`text-xs font-black px-2 py-0.5 rounded-full ${
                                isDry ? 'bg-red-100 text-red-600' : isWarn ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-700'
                              }`}>{label}</span>
                              <span className={`text-base font-black ${isDry ? 'text-red-500' : isWarn ? 'text-amber-500' : 'text-gray-900'}`}>
                                {entry.moisture}%
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${barColor} transition-all`}
                              style={{ width: `${entry.moisture}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
}
