import { useState } from 'react';
import { Download, MapPin, Search } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import DeckGL from '@deck.gl/react';
import { ScatterplotLayer, TextLayer, PathLayer } from '@deck.gl/layers';
import { PathStyleExtension } from '@deck.gl/extensions';
import Map from 'react-map-gl/maplibre';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)); 
  return R * c;
}

function optimizeRoute(treesList) {
  if (treesList.length === 0) return [];
  let unvisited = [...treesList];
  let currentTree = unvisited.shift(); 
  let route = [currentTree];
  while (unvisited.length > 0) {
    let nearestIdx = 0;
    let minDistance = Infinity;
    for (let i = 0; i < unvisited.length; i++) {
      const dist = getDistance(currentTree.pos[0], currentTree.pos[1], unvisited[i].pos[0], unvisited[i].pos[1]);
      if (dist < minDistance) {
        minDistance = dist;
        nearestIdx = i;
      }
    }
    currentTree = unvisited[nearestIdx];
    route.push(currentTree);
    unvisited.splice(nearestIdx, 1);
  }
  return route;
}

export default function AdminRoutes() {
  const { trees } = useOutletContext();
  const [activeDriver, setActiveDriver] = useState(4);
  
  // Daily schedule per driver (mock data)
  const schedules = {
    1: [
      { time: '07:30', end: '09:00', zone: 'Südstadt West',    stops: 8,  status: 'done',     liters: 320 },
      { time: '09:30', end: '11:00', zone: 'Durlach North',    stops: 6,  status: 'done',     liters: 240 },
      { time: '14:00', end: '15:30', zone: 'Innenstadt-Ost',   stops: 10, status: 'upcoming', liters: 400 },
    ],
    2: [
      { time: '08:00', end: '09:30', zone: 'Europaviertel',    stops: 5,  status: 'done',     liters: 200 },
      { time: '10:00', end: '12:00', zone: 'Nordstadt Critical',stops: 12, status: 'active', progress: 65, liters: 480 },
      { time: '13:30', end: '14:30', zone: 'Oststadt Park',    stops: 7,  status: 'upcoming', liters: 280 },
    ],
    4: [
      { time: '13:00', end: '14:30', zone: 'Downtown Critical', stops: 12, status: 'upcoming', liters: 480 },
      { time: '15:30', end: '16:30', zone: 'Wetterseite',      stops: 5,  status: 'upcoming', liters: 200 },
    ],
    5: [],
  };

  const drivers = [
    { id: 1, name: 'Markus Berg',   status: 'Available', vehicle: 'Watering Truck' },
    { id: 2, name: 'Anna Schmidt',  status: 'On Route',  vehicle: 'Maintenance Van', progress: 65 },
    { id: 4, name: 'Hans Müller',  status: 'Standby',   vehicle: 'Heavy Tanker' },
    { id: 5, name: 'Klaus Weber',   status: 'Off Duty',  vehicle: 'Watering Truck' },
  ];

  const activeDriverObj  = drivers.find(d => d.id === activeDriver);
  const activeDriverTrip = (schedules[activeDriver] ?? []).find(t => t.status === 'active')
                        ?? (schedules[activeDriver] ?? []).find(t => t.status === 'upcoming')
                        ?? null;

  const stopsWithIndex = (() => {
    if (!activeDriverTrip) return [];
    
    // Dynamic stop generation based on zone
    let baseTrees = [];
    const zone = activeDriverTrip.zone;
    if (zone.includes('Downtown') || zone.includes('Nordstadt')) {
      baseTrees = trees.filter(t => t.moisture < 20).slice(0, 12);
    } else if (zone.includes('Südstadt') || zone.includes('Innenstadt')) {
      baseTrees = trees.filter(t => t.stadtteil?.includes('Südstadt') || t.id % 3 === 0).slice(0, 10);
    } else if (zone.includes('Durlach')) {
      baseTrees = trees.filter(t => t.stadtteil?.includes('Durlach') || t.id % 4 === 0).slice(0, 6);
    } else if (zone.includes('Europa')) {
      baseTrees = trees.filter(t => t.id % 5 === 0).slice(0, 5);
    } else if (zone.includes('Oststadt') || zone.includes('Park')) {
      baseTrees = trees.filter(t => t.id % 7 === 0).slice(0, 7);
    } else {
      baseTrees = trees.slice(0, 8);
    }
    
    const optimized = optimizeRoute(baseTrees);
    const progressVal = activeDriverObj?.progress ?? 0;
    
    return optimized.map((t, i) => {
      let status = 'upcoming';
      if (activeDriverObj?.status === 'On Route') {
        const completedCount = Math.floor(optimized.length * progressVal / 100);
        if (i < completedCount) {
          status = 'done';
        } else if (i === completedCount) {
          status = 'active';
        }
      }
      return { ...t, stopNum: i + 1, status };
    });
  })();

  const driverPositions = {
    1: [49.0069, 8.4038], // Markus — Durlach (finished morning rounds)
    2: stopsWithIndex.find(s => s.status === 'active')?.pos ?? [49.008, 8.403], // Anna — active stop on map
    4: [49.0034, 8.3926], // Hans — central depot (Standby)
    5: null,              // Klaus — off duty, not tracked
  };

  const activeDriverPos  = driverPositions[activeDriver] ?? null;

  // Map centre: prefer active driver position, fall back to first stop
  const mapCenter = activeDriverPos
    ?? (stopsWithIndex.length > 0 ? stopsWithIndex[0].pos : [49.005, 8.403]);

  const manifestTrees = optimizeRoute(trees.filter(t => t.moisture < 20).slice(0, 12));

  return (
    <div className="space-y-6 flex flex-col h-full">
      <header className="mb-4 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-gray-900">Fleet & Dispatch</h1>
          <p className="text-gray-500 mt-1">Assign dynamically generated routes and track city drivers in real-time.</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-100 text-gray-700 px-4 py-2 rounded-xl font-bold flex items-center shadow-xl hover:bg-gray-50 transition-colors">
            Manage Access
          </button>
          <button 
            onClick={() => {
              localStorage.setItem('activeDriverRoute', JSON.stringify(manifestTrees));
              alert('Route successfully dispatched to Hans Müller (Truck #4)! Open the Driver App to see it.');
            }}
            className="bg-gray-900 text-white px-6 py-2 rounded-xl font-bold flex items-center shadow-lg hover:bg-gray-800 transition-colors active:scale-95"
          >
            <Download className="mr-2" size={18} />
            Dispatch Ticket
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-12 gap-6 min-h-0">
        
        {/* Left Column: Drivers & Drag-and-Drop UI */}
        <div className="col-span-4 bg-white border border-gray-100 rounded-3xl shadow-xl flex flex-col overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-gray-50">
            <h2 className="font-black text-gray-900">Active Workforce</h2>
            <div className="relative mt-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input type="text" placeholder="Search drivers..." className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-earthy-green" />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {drivers.map(driver => (
              <div 
                key={driver.id}
                onClick={() => setActiveDriver(driver.id)}
                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${activeDriver === driver.id ? 'border-gray-900 bg-gray-50 shadow-sm' : 'border-transparent hover:bg-gray-50'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-black text-gray-600 mr-3 text-sm">
                      {driver.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-sm leading-tight">{driver.name}</h3>
                      <p className="text-xs text-gray-500 font-medium">#{driver.id} · {driver.vehicle}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                      driver.status === 'Available' ? 'bg-earthy-green/10 text-earthy-green' :
                      driver.status === 'Standby'   ? 'bg-amber-50 text-amber-600' :
                      driver.status === 'On Route'  ? 'bg-blue-50 text-blue-600' :
                      'bg-gray-100 text-gray-500'
                    }`}>
                      {driver.status === 'On Route' && <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full mr-1 animate-pulse" />}
                      {driver.status}
                    </span>
                    {(schedules[driver.id]?.length ?? 0) > 0 && (
                      <span className="text-[10px] font-bold text-gray-400">
                        {schedules[driver.id].filter(t => t.status === 'done').length}/{schedules[driver.id].length} trips
                      </span>
                    )}
                  </div>
                </div>
                {/* Schedule Timeline */}
                {activeDriver === driver.id && (
                  <div className="mt-3 pt-3 border-t border-gray-100" onClick={e => e.stopPropagation()}>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Today's Schedule</p>
                    {(schedules[driver.id]?.length ?? 0) === 0 ? (
                      <div className="text-center py-4 text-gray-400">
                        <p className="text-xs font-bold">Off duty — no trips today</p>
                      </div>
                    ) : (
                      <div className="relative pl-5">
                        {/* Vertical timeline spine */}
                        <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gray-100 rounded-full" />
                        <div className="space-y-2.5">
                          {schedules[driver.id].map((trip, i) => (
                            <div key={i} className="relative">
                              {/* Timeline dot */}
                              <div className={`absolute -left-5 top-3 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                                trip.status === 'done'     ? 'bg-earthy-green' :
                                trip.status === 'active'   ? 'bg-blue-500 animate-pulse' :
                                'bg-gray-300'
                              }`} />
                              <div className={`rounded-xl p-2.5 border transition-all ${
                                trip.status === 'done'   ? 'bg-gray-50 border-gray-100' :
                                trip.status === 'active' ? 'bg-blue-50 border-blue-100 shadow-sm' :
                                'bg-white border-gray-100'
                              }`}>
                                <div className="flex items-start justify-between gap-2">
                                  <div className="min-w-0">
                                    <p className={`font-bold text-xs truncate ${
                                      trip.status === 'done' ? 'text-gray-400' : 'text-gray-900'
                                    }`}>{trip.zone}</p>
                                    <p className="text-[10px] text-gray-400 font-bold mt-0.5">{trip.time} – {trip.end}</p>
                                  </div>
                                  <div className="flex flex-col items-end gap-1 shrink-0">
                                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                                      trip.status === 'done'   ? 'bg-earthy-green/10 text-earthy-green' :
                                      trip.status === 'active' ? 'bg-blue-100 text-blue-600' :
                                      'bg-gray-100 text-gray-500'
                                    }`}>{trip.stops} stops</span>
                                    <span className="text-[10px] text-gray-400 font-bold">{trip.liters}L</span>
                                  </div>
                                </div>
                                {trip.status === 'active' && trip.progress && (
                                  <div className="mt-2">
                                    <div className="flex justify-between mb-1">
                                      <span className="text-[10px] text-blue-500 font-black">In progress</span>
                                      <span className="text-[10px] text-blue-500 font-black">{trip.progress}%</span>
                                    </div>
                                    <div className="h-1.5 bg-blue-100 rounded-full overflow-hidden">
                                      <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${trip.progress}%` }} />
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Route Details & Live Map */}
        <div className="col-span-8 flex flex-col space-y-6 min-h-0">
          
          <div className="bg-white border border-gray-100 rounded-3xl shadow-xl p-6 grid grid-cols-4 gap-4 shrink-0">
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Selected Driver</p>
              <h2 className="text-xl font-black text-gray-900 truncate">{activeDriverObj?.name ?? '—'}</h2>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Active Zone</p>
              <p className="text-xl font-black text-gray-900 truncate">{activeDriverTrip?.zone ?? 'No active trip'}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Stops</p>
              <p className="text-xl font-black text-gray-900">{activeDriverTrip?.stops ?? '—'}</p>
            </div>
            <div className={`rounded-xl p-3 flex items-center justify-center flex-col border ${
              activeDriverObj?.status === 'On Route'  ? 'bg-blue-50 border-blue-100' :
              activeDriverObj?.status === 'Available' ? 'bg-earthy-green/10 border-earthy-green/20' :
              activeDriverObj?.status === 'Standby'   ? 'bg-amber-50 border-amber-100' :
              'bg-gray-50 border-gray-100'
            }`}>
              <p className={`text-[10px] font-bold uppercase tracking-widest ${
                activeDriverObj?.status === 'On Route'  ? 'text-blue-500' :
                activeDriverObj?.status === 'Available' ? 'text-earthy-green' :
                activeDriverObj?.status === 'Standby'   ? 'text-amber-600' : 'text-gray-400'
              }`}>Status</p>
              <p className={`text-lg font-black leading-none mt-1 ${
                activeDriverObj?.status === 'On Route'  ? 'text-blue-600' :
                activeDriverObj?.status === 'Available' ? 'text-earthy-green' :
                activeDriverObj?.status === 'Standby'   ? 'text-amber-600' : 'text-gray-500'
              }`}>{activeDriverObj?.status ?? '—'}</p>
            </div>
          </div>

          <div className="flex-1 rounded-3xl shadow-xl overflow-hidden relative border border-gray-100">
            {manifestTrees.length > 0 && (
              <DeckGL
                initialViewState={{
                  longitude: mapCenter[1],
                  latitude:  mapCenter[0],
                  zoom: 13, pitch: 0, bearing: 0
                }}
                controller={true}
                style={{ width: '100%', height: '100%' }}
                layers={[
                  new PathLayer({
                    id: 'route-dashed',
                    data: [{
                      path: stopsWithIndex.map(t => [t.pos[1], t.pos[0]]),
                    }],
                    getPath: d => d.path,
                    getColor: activeDriverObj?.status === 'On Route' ? [59, 130, 246, 200] : [245, 158, 11, 200],
                    getWidth: 3,
                    widthMinPixels: 3,
                    getDashArray: [10, 6],
                    dashJustified: true,
                    extensions: [new PathStyleExtension({ dash: true })],
                  }),
                  new ScatterplotLayer({
                    id: 'route-stops-halo',
                    data: stopsWithIndex,
                    getPosition: d => [d.pos[1], d.pos[0]],
                    getFillColor: d => 
                      d.status === 'done' ? [229, 231, 235, 255] :
                      d.status === 'active' ? [59, 130, 246, 255] : [255, 255, 255, 255],
                    getRadius: 28,
                    radiusMinPixels: 20,
                    stroked: false,
                  }),
                  new ScatterplotLayer({
                    id: 'route-stops',
                    data: stopsWithIndex,
                    getPosition: d => [d.pos[1], d.pos[0]],
                    getFillColor: d => 
                      d.status === 'done' ? [156, 163, 175, 255] :
                      d.status === 'active' ? [59, 130, 246, 255] :
                      (activeDriverObj?.status === 'On Route' ? [220, 38, 38, 255] : [245, 158, 11, 255]),
                    getRadius: 22,
                    radiusMinPixels: 16,
                    stroked: false,
                  }),
                  new TextLayer({
                    id: 'stop-numbers',
                    data: stopsWithIndex,
                    getPosition: d => [d.pos[1], d.pos[0]],
                    getText: d => String(d.stopNum),
                    getSize: 16,
                    getColor: [255, 255, 255, 255],
                    fontWeight: 'bold',
                    getTextAnchor: 'middle',
                    getAlignmentBaseline: 'center',
                    billboard: true,
                  }),
                  // Live Driver Location Marker (only if driver is GPS-tracked)
                  ...(activeDriverPos ? [new ScatterplotLayer({
                    id: 'driver-location',
                    data: [{ pos: activeDriverPos }],
                    getPosition: d => [d.pos[1], d.pos[0]],
                    getFillColor: [59, 130, 246, 255],
                    getRadius: 30,
                    radiusMinPixels: 12,
                    getLineColor: [255, 255, 255],
                    lineWidthMinPixels: 3,
                  })] : [])
                ]}
              >
                <Map mapLib={maplibregl} mapStyle={MAP_STYLE} />
              </DeckGL>
            )}
            
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl px-4 py-2.5 rounded-xl flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_10px_#3b82f6] animate-pulse" />
              <div>
                <p className="text-xs font-black text-gray-800">{activeDriverObj?.name ?? 'Unknown'}</p>
                <p className="text-[10px] text-gray-500 font-bold">{activeDriverTrip?.zone ?? activeDriverObj?.status ?? ''}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
