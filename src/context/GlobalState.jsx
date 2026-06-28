import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import treesData from '../data/trees.json';

const GlobalStateContext = createContext();

export function GlobalProvider({ children }) {
  const [trees, setTrees] = useState(treesData);
  const [ecoPoints, setEcoPoints] = useState(1250);

  // Calculate an optimized, clustered route for the driver using Nearest Neighbor
  const initialStops = useMemo(() => {
    const thirsty = treesData.filter(t => t.moisture < 20);
    if (thirsty.length === 0) return [];

    const route = [];
    let current = thirsty[0]; // Start at the first thirsty tree
    route.push(current);
    thirsty.splice(0, 1);

    // Build a cluster of 8 geographically close stops
    while (route.length < 8 && thirsty.length > 0) {
      let nearestIdx = 0;
      let minDistance = Infinity;

      for (let i = 0; i < thirsty.length; i++) {
        const t = thirsty[i];
        const dx = t.pos[0] - current.pos[0];
        const dy = t.pos[1] - current.pos[1];
        const distSq = dx * dx + dy * dy; // Distance squared

        if (distSq < minDistance) {
          minDistance = distSq;
          nearestIdx = i;
        }
      }

      current = thirsty[nearestIdx];
      route.push(current);
      thirsty.splice(nearestIdx, 1);
    }

    return route;
  }, []);
  const [driverStops, setDriverStops] = useState(initialStops);
  const [completedStops, setCompletedStops] = useState([]);

  // Water a tree globally
  const waterTree = useCallback((id) => {
    setTrees(prev => {
      // Find and update the specific tree
      // Optimization: We avoid a full .map over 30,000 items if we can, but a shallow clone + map is standard.
      // 30,000 array map takes ~1-2ms in modern JS, perfectly fine for occasional clicks.
      return prev.map(t => t.id === id ? { ...t, moisture: 100 } : t);
    });
     setEcoPoints(prev => prev + 50); // Add points
  }, []);

  // Shared Tickets for Civic Eyes Reports (Citizen ➔ Admin)
  const [tickets, setTickets] = useState([
    { id: 1, treeName: "Linden (Tilia)", issue: "Broken Branches", status: "Open", date: "June 27, 2026" },
    { id: 2, treeName: "Maple (Acer)", issue: "Trash Accumulation", status: "Open", date: "June 28, 2026" }
  ]);

  const addTicket = useCallback((treeName, issue) => {
    setTickets(prev => [
      ...prev,
      {
        id: Date.now(),
        treeName,
        issue,
        status: "Open",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
      }
    ]);
  }, []);

  // Complete driver stop
  const completeStop = useCallback((id) => {
    setCompletedStops(prev => {
      if (prev.includes(id)) return prev;
      return [...prev, id];
    });
    waterTree(id); // Also updates the tree globally!
  }, [waterTree]);

  // Update tree IoT Node configuration from field technicians (Field Tech ➔ Admin/Citizen)
  const updateTreeConfig = useCallback((id, updates) => {
    setTrees(prev => prev.map(t => t.id === id ? { ...t, ...updates, battery: 100 } : t));
  }, []);

  // Dispatch new active route stops from operations command (Admin ➔ Field Tech)
  const dispatchNewRoute = useCallback((stops) => {
    setDriverStops(stops);
    setCompletedStops([]); // Reset progress
  }, []);

  // Revert all prototype states to fresh defaults
  const resetDemo = useCallback(() => {
    setTrees(treesData);
    setEcoPoints(1250);
    setDriverStops(initialStops);
    setCompletedStops([]);
    setTickets([
      { id: 1, treeName: "Linden (Tilia)", issue: "Broken Branches", status: "Open", date: "June 27, 2026" },
      { id: 2, treeName: "Maple (Acer)", issue: "Trash Accumulation", status: "Open", date: "June 28, 2026" }
    ]);
  }, [initialStops]);

  const value = {
    trees,
    ecoPoints,
    waterTree,
    driverStops,
    completedStops,
    completeStop,
    tickets,
    addTicket,
    updateTreeConfig,
    dispatchNewRoute,
    resetDemo
  };

  return (
    <GlobalStateContext.Provider value={value}>
      {children}
    </GlobalStateContext.Provider>
  );
}

export function useGlobalState() {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalProvider');
  }
  return context;
}
