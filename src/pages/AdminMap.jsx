import { useState, useCallback, useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import DeckGL from '@deck.gl/react';
import { TextLayer, ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Droplet, MapPin, Wifi, X, Trees, Navigation, Filter, Lock, Unlock, Zap, Droplets } from 'lucide-react';

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
    <div className="space-y-4 h-full flex flex-col">
      <header className="mb-2 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">GIS Live Map</h1>
          <p className="text-gray-500 mt-1">Real-time telemetry and infrastructure overlays.</p>
        </div>
        
        {/* Filters Toolbar */}
        <div className="flex space-x-3">
          <div className="bg-white border border-gray-200 rounded-xl p-1.5 flex shadow-sm">
            <button onClick={() => setUrgencyFilter('all')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${urgencyFilter==='all' ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>All</button>
            <button onClick={() => setUrgencyFilter('critical')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${urgencyFilter==='critical' ? 'bg-red-500 text-white' : 'text-gray-500 hover:bg-red-50'}`}>Critical</button>
            <button onClick={() => setUrgencyFilter('warning')} className={`px-4 py-2 text-sm font-bold rounded-lg transition-colors ${urgencyFilter==='warning' ? 'bg-amber-500 text-white' : 'text-gray-500 hover:bg-amber-50'}`}>Warning</button>
          </div>
          
          <button 
            onClick={() => setBatteryFilter(!batteryFilter)}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${batteryFilter ? 'bg-orange-100 border-orange-200 text-orange-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'}`}
          >
            <Zap size={16} className="mr-2" /> Low Battery
          </button>
          
          <button 
            onClick={() => setShowWaterSources(!showWaterSources)}
            className={`flex items-center px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${showWaterSources ? 'bg-blue-100 border-blue-200 text-blue-700' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm'}`}
          >
            <Droplets size={16} className="mr-2" /> Public Taps
          </button>
        </div>
      </header>

      <div className="bg-gray-900 rounded-3xl shadow-xl flex-1 relative overflow-hidden min-h-[600px] border border-gray-800">
        <DeckGL
          initialViewState={INITIAL_VIEW_STATE}
          controller={true}
          layers={layers}
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
          <div className="absolute top-6 right-6 w-80 bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden transform transition-all animate-in slide-in-from-right-8">
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
            
            <div className="p-6 space-y-5">
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

              <div className="pt-4 border-t border-gray-100">
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
      </div>
    </div>
  );
}
