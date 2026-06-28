import { useState, useMemo, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, TextLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { Droplet, Info, X, Play, MapPin, Search, ChevronRight, Star, Navigation, BatteryLow, BatteryMedium, BatteryFull } from 'lucide-react';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

// Simulated User Location
const USER_LOC = [48.970698, 8.480784];

const WATER_SOURCES = [
  { pos: [48.970, 8.481], name: "Public Fountain" },
  { pos: [48.972, 8.479], name: "Rain Barrel" }
];

export default function CitizenMap() {
  const { trees, handleScan } = useOutletContext();
  const [selectedTree, setSelectedTree] = useState(null);
  const [isClaimed, setIsClaimed] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const [showNearbyList, setShowNearbyList] = useState(false);

  // Lock camera to simulate "Near Me"
  const [viewState, setViewState] = useState({
    longitude: USER_LOC[1],
    latitude: USER_LOC[0],
    zoom: 15,
    pitch: 45,
    bearing: 0
  });

  // Calculate distances for the popup list (Thirsty trees only)
  const nearbyThirstyTrees = useMemo(() => {
    return trees
      .filter(t => t.moisture < 50)
      .map(t => {
        const dx = t.pos[0] - USER_LOC[0];
        const dy = t.pos[1] - USER_LOC[1];
        const distKm = Math.sqrt(dx * dx + dy * dy) * 111; // Rough km conversion
        return { ...t, distance: distKm };
      })
      .filter(t => t.distance <= 1.0) // Within 1km
      .sort((a, b) => a.distance - b.distance);
  }, [trees]);

  const layers = [
    // 1. All Trees Layer (Colored Dots, flexible size based on zoom)
    new ScatterplotLayer({
      id: 'tree-dots',
      data: trees,
      getPosition: d => [d.pos[1], d.pos[0]],
      getFillColor: d => {
        if (d.moisture > 80) return [34, 197, 94, 150]; // Green for healthy/saturated
        if (d.moisture < 20) return [239, 68, 68, 255]; // Red for critical
        return [234, 179, 8, 255]; // Yellow for warning
      },
      // Use meters so dots grow naturally when zooming in!
      radiusUnits: 'meters',
      getRadius: d => selectedTree?.id === d.id ? 8 : 4,
      radiusMinPixels: 4,
      lineWidthMinPixels: 2,
      getLineColor: [255, 255, 255, 200],
      stroked: true,
      pickable: true,
      onClick: ({object}) => {
        if (object) {
          setShowNearbyList(false);
          setSelectedTree(object);
          setIsClaimed(false);
          setViewState({
            longitude: object.pos[1],
            latitude: object.pos[0] - 0.0005, // Offset for UI
            zoom: 18,
            pitch: 60,
            bearing: 0,
            transitionDuration: 1000
          });
        }
      }
    }),
    
    // 2. Simulated User Location Indicator
    new ScatterplotLayer({
      id: 'user-location',
      data: [{ pos: USER_LOC }],
      getPosition: d => [d.pos[1], d.pos[0]],
      getFillColor: [59, 130, 246, 255], // Solid Blue
      radiusUnits: 'meters',
      getRadius: 6,
      radiusMinPixels: 8,
      getLineColor: [255, 255, 255, 255],
      lineWidthMinPixels: 3,
      stroked: true,
    }),

    // 3. Water Sources (if toggled)
    ...(showSources ? [
      new TextLayer({
        id: 'water-sources-icons',
        data: WATER_SOURCES,
        getPosition: d => [d.pos[1], d.pos[0]],
        getText: () => '🚰',
        getSize: 32,
        background: true,
        getBackgroundColor: [200, 230, 255, 255]
      })
    ] : [])
  ];

  const getDifficulty = (moisture) => {
    if (moisture < 20) return "Needs 20 Liters (2 buckets)";
    if (moisture < 50) return "Needs 10 Liters (1 small bucket)";
    return "Needs 2 Liters (1 water bottle)";
  };

  const getTrivia = (species) => {
    if (species.includes("Tilia")) return "Linden trees can live for hundreds of years and are known as the 'tree of lovers'.";
    if (species.includes("Acer")) return "Maple trees are famous for their brilliant fall colors and sap!";
    return "This tree provides enough oxygen for 2 people every day!";
  };

  const getBatteryStatus = (treeId) => {
    const battPct = treeId % 5 === 0 ? 9 : treeId % 3 === 0 ? 42 : 78;
    const isLow = battPct < 20;
    const isMed = battPct < 50;
    const BattIcon = isLow ? BatteryLow : isMed ? BatteryMedium : BatteryFull;
    const battColor = isLow ? 'text-red-500' : isMed ? 'text-amber-500' : 'text-earthy-green';
    const barColor = isLow ? 'bg-red-500' : isMed ? 'bg-amber-500' : 'bg-earthy-green';
    const bgColor = isLow ? 'bg-red-50/50 border-red-100' : isMed ? 'bg-amber-50/50 border-amber-100' : 'bg-green-50/50 border-green-100';
    return (
      <div className={`flex items-center gap-3 p-3 rounded-2xl border ${bgColor} mb-4`}>
        <BattIcon size={16} className={battColor} />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">Sensor Battery</span>
            <span className={`text-xs font-black ${battColor}`}>{battPct}%</span>
          </div>
          <div className="w-full h-1 bg-gray-250 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${barColor} transition-all`} style={{ width: `${battPct}%` }} />
          </div>
        </div>
      </div>
    );
  };

  const onMapLoad = useCallback((e) => {
    const map = e.target;
    if (!map.getLayer('3d-buildings')) {
      map.addLayer({
        'id': '3d-buildings',
        'source': 'carto',
        'source-layer': 'building',
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
          'fill-extrusion-color': '#e5e7eb',
          'fill-extrusion-height': ['coalesce', ['get', 'render_height'], ['get', 'height'], 15],
          'fill-extrusion-opacity': 0.6
        }
      });
    }
  }, []);

  return (
    <div className="h-full relative bg-gray-bg">
      <DeckGL
        viewState={viewState}
        onViewStateChange={({viewState}) => setViewState(viewState)}
        controller={true}
        layers={layers}
      >
        <Map mapLib={maplibregl} mapStyle={MAP_STYLE} onLoad={onMapLoad} />
      </DeckGL>

      {/* Top HUD */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
        
        {/* Clickable Near Me Button */}
        <button 
          onClick={() => setShowNearbyList(true)}
          className="bg-white/95 backdrop-blur-md px-4 py-3.5 rounded-3xl shadow-xl border border-gray-100 flex flex-col pointer-events-auto active:scale-95 transition-transform text-left"
        >
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-earthy-green rounded-full animate-ping" />
            <MapPin size={11} /> Near Me (1km)
          </p>
          <p className="font-black text-gray-900 mt-1 text-sm">{nearbyThirstyTrees.length} Thirsty Trees <span className="text-earthy-green ml-1 text-xs font-bold">List ➔</span></p>
        </button>
        
        <button 
          onClick={() => setShowSources(!showSources)}
          className={`p-3 rounded-2xl shadow-xl border transition-all pointer-events-auto ${showSources ? 'bg-blue-500 text-white border-blue-600' : 'bg-white/95 backdrop-blur-md text-blue-500 border-gray-100'}`}
        >
          <Droplet size={20} />
        </button>
      </div>

      {/* Nearby List Popup */}
      {showNearbyList && (
        <div className="absolute inset-x-0 bottom-0 bg-white/95 backdrop-blur-md rounded-t-[32px] p-6 shadow-2xl border-t border-gray-100 animate-in slide-in-from-bottom-8 z-20 max-h-[70vh] flex flex-col">
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h2 className="text-xl font-black text-gray-900">Nearby Thirsty Trees</h2>
            <button 
              onClick={() => setShowNearbyList(false)}
              className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 pb-20">
            {nearbyThirstyTrees.slice(0, 20).map(tree => (
              <div 
                key={tree.id}
                onClick={() => {
                  setShowNearbyList(false);
                  setSelectedTree(tree);
                  setIsClaimed(false);
                  setViewState({
                    longitude: tree.pos[1],
                    latitude: tree.pos[0] - 0.0005,
                    zoom: 18,
                    pitch: 60,
                    bearing: 0,
                    transitionDuration: 1000
                  });
                }}
                className="bg-white/50 rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
              >
                <div className="flex items-center">
                  <div className={`text-2xl mr-3 ${tree.moisture < 20 ? 'text-red-500' : 'text-yellow-500'}`}>
                    {tree.moisture < 20 ? '🥀' : '🌱'}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{tree.name.split(' ')[0]}</h3>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mt-0.5">
                      {(tree.distance * 1000).toFixed(0)} meters away
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="text-gray-300" />
              </div>
            ))}
            {nearbyThirstyTrees.length === 0 && (
              <p className="text-gray-500 text-center mt-6 font-medium">All trees within 1km are perfectly hydrated! 🌳</p>
            )}
          </div>
        </div>
      )}

      {/* Discovery / Action Overlay */}
      {selectedTree && !showNearbyList && (
        <div className="absolute bottom-6 left-4 right-4 bg-white/95 backdrop-blur-md rounded-[32px] p-6 shadow-2xl border border-gray-100 animate-in slide-in-from-bottom-8 z-10">
          <button 
            onClick={() => setSelectedTree(null)}
            className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={20} />
          </button>
          
          {selectedTree.moisture > 80 ? (
            <div className="animate-in fade-in zoom-in-95 mt-2">
              <div className="flex items-center justify-between mb-4 pr-12">
                <div className="flex items-center">
                  <div className="text-4xl mr-4">🌳</div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 leading-none">{selectedTree.name.split(' ')[0]}</h2>
                    <p className="text-xs font-bold text-earthy-green mt-1.5 uppercase tracking-wider">Perfectly Hydrated</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-black text-earthy-green">{selectedTree.moisture}%</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Moisture</p>
                </div>
              </div>

              {/* moisture percentage bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
                <div className="h-full bg-earthy-green rounded-full transition-all" style={{ width: `${selectedTree.moisture}%` }} />
              </div>

              {getBatteryStatus(selectedTree.id)}
              
              <div className="bg-gray-50/50 rounded-2xl p-4 mb-4 border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tree Trivia</p>
                <p className="text-sm font-medium text-gray-600">{getTrivia(selectedTree.name)}</p>
              </div>

              <div className="bg-earthy-green/10 rounded-2xl p-4 border border-earthy-green/20">
                <p className="text-xs font-bold text-earthy-green uppercase tracking-widest mb-1 flex items-center">
                  <Star size={12} className="mr-1" /> Ongoing Impact
                </p>
                <p className="text-sm font-bold text-gray-900 leading-tight">
                  Because this tree is healthy, it is actively absorbing CO2 and keeping your street noticeably cooler!
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 pr-12">
                <div className="flex items-center">
                  <div className="text-4xl mr-4">{selectedTree.moisture < 20 ? '🥀' : '🌱'}</div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 leading-none">Help this {selectedTree.name.split(' ')[0]}</h2>
                    <p className="text-xs font-bold text-gray-400 mt-1.5">{getDifficulty(selectedTree.moisture)}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-2xl font-black ${selectedTree.moisture < 20 ? 'text-red-500' : 'text-amber-500'}`}>{selectedTree.moisture}%</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">Moisture</p>
                </div>
              </div>

              {/* moisture percentage bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
                <div className={`h-full rounded-full transition-all ${
                  selectedTree.moisture < 20 ? 'bg-red-500' : 'bg-amber-400'
                }`} style={{ width: `${selectedTree.moisture}%` }} />
              </div>

              {getBatteryStatus(selectedTree.id)}

              {!isClaimed ? (
                <>
                  <div className="bg-blue-50 rounded-2xl p-4 mb-4 border border-blue-100">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1 flex items-center">
                      <Search size={12} className="mr-1" /> Source Water
                    </p>
                    <p className="text-sm font-bold text-blue-900">
                      {showSources ? "Grab water from the highlighted fountain!" : "Fill a bucket at home before heading out."}
                    </p>
                  </div>

                  <div className="bg-earthy-green/10 rounded-2xl p-4 mb-6 border border-earthy-green/20">
                    <p className="text-xs font-bold text-earthy-green uppercase tracking-widest mb-1 flex items-center">
                      <Star size={12} className="mr-1" /> Your Impact
                    </p>
                    <p className="text-sm font-bold text-gray-900 leading-tight">
                      Watering this tree helps it absorb 1.5kg of CO2 today and keeps your street noticeably cooler during heatwaves!
                    </p>
                  </div>

                  <button 
                    onClick={() => setIsClaimed(true)}
                    className="w-full bg-earthy-green hover:bg-green-600 text-white font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-transform active:scale-95 text-lg"
                  >
                    Adopt
                  </button>
                </>
              ) : (
                <div className="animate-in fade-in zoom-in-95 space-y-4">
                  <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                    <p className="text-xs font-bold text-orange-400 uppercase tracking-widest mb-1 flex items-center">
                      <Info size={12} className="mr-1" /> How to water
                    </p>
                    <p className="text-sm font-bold text-orange-900">
                      Pour slowly near the base. Avoid splashing the leaves to prevent sunburn.
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Tree Trivia</p>
                    <p className="text-sm font-medium text-gray-600">{getTrivia(selectedTree.name)}</p>
                  </div>

                  <div className="space-y-3 pt-2">
                    {/* View in Map button */}
                    <button 
                      onClick={() => {
                        window.open(`https://www.google.com/maps/dir/?api=1&destination=${selectedTree.pos[0]},${selectedTree.pos[1]}`, '_blank');
                      }}
                      className="w-full bg-white border border-gray-200 text-gray-700 font-bold py-3.5 rounded-2xl shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Navigation size={16} className="text-blue-500 fill-blue-500" />
                      View in Map
                    </button>

                    {/* Watering Complete button */}
                    <button 
                      onClick={() => {
                        handleScan(selectedTree.id, true);
                        setSelectedTree(null);
                      }}
                      className="w-full bg-gray-900 text-white font-black py-4 rounded-2xl shadow-lg transition-transform active:scale-95 text-lg flex items-center justify-center"
                    >
                      <Play size={20} className="mr-2" />
                      Watering Complete!
                    </button>

                    {/* Un-adopt button */}
                    <button 
                      onClick={() => setIsClaimed(false)}
                      className="w-full text-center text-xs font-bold text-red-500 hover:text-red-700 py-1 transition-colors uppercase tracking-widest"
                    >
                      Un-adopt tree
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
