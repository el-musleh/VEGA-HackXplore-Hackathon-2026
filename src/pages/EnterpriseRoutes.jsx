import { useState, useMemo, useCallback } from 'react';
import { Navigation, Droplet, Battery, MapPin, CheckCircle, Droplets, Map as MapIcon, ChevronRight } from 'lucide-react';
import DeckGL from '@deck.gl/react';
import { PathLayer, ScatterplotLayer } from '@deck.gl/layers';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { useGlobalState } from '../context/GlobalState';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

const WATER_SOURCES = [
  { pos: [49.0069, 8.4037] },
  { pos: [49.01, 8.39] },
  { pos: [49.005, 8.41] }
];

export default function EnterpriseRoutes() {
  const { driverStops: routeStops, completedStops, completeStop } = useGlobalState();
  const [selectedStop, setSelectedStop] = useState(null);
  const [showHydrants, setShowHydrants] = useState(false);
  const [viewState, setViewState] = useState({
    longitude: routeStops.length > 0 ? routeStops[0].pos[1] : 8.4037, 
    latitude: routeStops.length > 0 ? routeStops[0].pos[0] : 49.0069, 
    zoom: 14, pitch: 45, bearing: 0
  });

  const activeStops = useMemo(() => {
    return routeStops.filter(tree => !completedStops.includes(tree.id));
  }, [routeStops, completedStops]);

  const handleStopSelect = (tree) => {
    setSelectedStop(tree);
    setViewState({
      longitude: tree.pos[1],
      latitude: tree.pos[0],
      zoom: 18, // Zoom in extremely close for "Proximity Ping"
      pitch: 60,
      bearing: 0,
      transitionDuration: 1000 // Smooth cinematic fly-to
    });
  };

  const verifySensor = () => {
    if (!selectedStop) return;
    
    // Simulate IoT Sync Delay
    setTimeout(() => {
      completeStop(selectedStop.id);
      setSelectedStop(null);
      
      // Zoom back out to route overview
      if (activeStops.length > 1) {
        const nextStop = activeStops.find(t => t.id !== selectedStop.id);
        if (nextStop) {
          setViewState({
            longitude: nextStop.pos[1],
            latitude: nextStop.pos[0],
            zoom: 15,
            pitch: 45,
            bearing: 0,
            transitionDuration: 1000
          });
        }
      }
    }, 800);
  };

  // Generate Google Maps URL for the remaining route
  const getGoogleMapsUrl = () => {
    if (activeStops.length === 0) return '#';
    // Add 'Current+Location' as the origin so Google Maps navigates from the driver's GPS
    const coords = activeStops.map(t => `${t.pos[0]},${t.pos[1]}`).join('/');
    return `https://www.google.com/maps/dir/Current+Location/${coords}`;
  };

  const layers = [
    new PathLayer({
      id: 'route-path',
      data: activeStops.length > 1 ? [{
        path: activeStops.map(t => [t.pos[1], t.pos[0]]),
        color: [34, 197, 94] // earthy-green
      }] : [],
      getPath: d => d.path,
      getColor: d => d.color,
      getWidth: 6,
      widthMinPixels: 4,
    }),
    new ScatterplotLayer({
      id: 'route-stops',
      data: activeStops,
      getPosition: d => [d.pos[1], d.pos[0]],
      getFillColor: d => selectedStop && d.id === selectedStop.id ? [59, 130, 246, 255] : [255, 255, 255, 255],
      getRadius: d => selectedStop && d.id === selectedStop.id ? 20 : 15,
      radiusMinPixels: 6,
      stroked: true,
      lineWidthMinPixels: 3,
      getLineColor: [34, 197, 94, 255], // Green border to match the path
      pickable: true,
      onClick: ({object}) => object && handleStopSelect(object)
    }),
    ...(showHydrants ? [
      new ScatterplotLayer({
        id: 'water-sources',
        data: WATER_SOURCES,
        getPosition: d => [d.pos[1], d.pos[0]],
        getFillColor: [59, 130, 246, 200], // Blue
        getRadius: 25,
        radiusMinPixels: 8,
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
    <div className="flex flex-col h-full bg-gray-bg relative">
      
      {/* Top Map Area */}
      <div className="h-[45vh] relative shadow-lg z-10 rounded-b-3xl overflow-hidden bg-gray-200">
        <DeckGL
          viewState={viewState}
          onViewStateChange={({viewState}) => setViewState(viewState)}
          controller={true}
          layers={layers}
        >
          <Map mapLib={maplibregl} mapStyle={MAP_STYLE} onLoad={onMapLoad} />
        </DeckGL>

        {/* Map Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button 
            onClick={() => setShowHydrants(!showHydrants)}
            className={`p-3 rounded-xl shadow-lg border transition-all ${showHydrants ? 'bg-blue-500 text-white border-blue-600' : 'bg-white text-blue-500 border-gray-100'}`}
          >
            <Droplets size={20} />
          </button>
        </div>
      </div>

      {/* Bottom Panel */}
      <div className="flex-1 overflow-y-auto px-4 pt-6 pb-6 relative z-20 -mt-4 bg-gray-bg">
        
        {selectedStop ? (
          /* Task Card View */
          <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 animate-in slide-in-from-bottom-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Current Stop</p>
                <h2 className="text-2xl font-black text-gray-900">{selectedStop.name}</h2>
                <p className="text-sm text-gray-500 font-medium">#{selectedStop.id} • {selectedStop.stadtteil}</p>
              </div>
              <button 
                onClick={() => setSelectedStop(null)}
                className="bg-gray-100 p-2 rounded-full text-gray-400 hover:text-gray-900"
              >
                <ChevronRight size={20} className="rotate-180" />
              </button>
            </div>

            <div className="bg-blue-50 rounded-2xl p-4 mb-4 flex items-center justify-between border border-blue-100">
              <div className="flex items-center text-blue-700">
                <Droplet size={24} className="mr-3" />
                <div>
                  <p className="font-black text-lg">Dispense 40 Gallons</p>
                  <p className="text-xs font-bold uppercase tracking-wider">Watering Task</p>
                </div>
              </div>
            </div>

            {selectedStop.id % 5 === 0 && (
              <div className="bg-orange-50 rounded-2xl p-4 mb-6 flex items-center justify-between border border-orange-100">
                <div className="flex items-center text-orange-700">
                  <Battery size={24} className="mr-3" />
                  <div>
                    <p className="font-black text-lg">Replace 9V Battery</p>
                    <p className="text-xs font-bold uppercase tracking-wider">Hardware Task</p>
                  </div>
                </div>
              </div>
            )}

            <button 
              onClick={verifySensor}
              className="w-full bg-earthy-green hover:bg-green-600 text-white font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(34,197,94,0.3)] transition-colors flex items-center justify-center active:scale-95"
            >
              <CheckCircle size={20} className="mr-2" />
              Verify Sensor & Complete Task
            </button>
            <p className="text-center text-[10px] text-gray-400 font-bold mt-3 uppercase tracking-widest">
              Forces local IoT node to ping the network
            </p>
          </div>
        ) : (
          /* Route List View */
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-black text-gray-900">Route Manifest</h2>
              <a 
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center shadow-lg active:scale-95"
              >
                <Navigation size={14} className="mr-2" /> Navigate
              </a>
            </div>

            {activeStops.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center shadow-sm border border-gray-100">
                <CheckCircle size={48} className="text-earthy-green mx-auto mb-4" />
                <h3 className="font-black text-xl text-gray-900">Shift Complete</h3>
                <p className="text-gray-500 text-sm mt-2 font-medium">All tasks verified and synced.</p>
              </div>
            ) : (
              <div className="space-y-3 pb-8">
                {activeStops.map((stop, idx) => (
                  <div 
                    key={stop.id}
                    onClick={() => handleStopSelect(stop)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.98] transition-transform cursor-pointer"
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-black text-gray-600 text-sm mr-4 shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm leading-tight">{stop.name}</h3>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{stop.stadtteil}</p>
                      </div>
                    </div>
                    <ChevronRight size={20} className="text-gray-300" />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
