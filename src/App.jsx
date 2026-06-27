import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import Auth from './pages/Auth';
import Gateway from './pages/Gateway';

// Citizen Flow
import CitizenLayout from './components/CitizenLayout';
import CitizenMap from './pages/CitizenMap';
import CitizenProfile from './pages/CitizenProfile';
import CitizenLeaderboard from './pages/CitizenLeaderboard';
import CitizenRewards from './pages/CitizenRewards';

// Enterprise Flow
import EnterpriseLayout from './components/EnterpriseLayout';
import EnterpriseDashboard from './pages/EnterpriseDashboard';
import EnterpriseRoutes from './pages/EnterpriseRoutes';
import EnterpriseFleet from './pages/EnterpriseFleet';
import EnterpriseAlerts from './pages/EnterpriseAlerts';

// Desktop Admin Flow (Separated Website)
import AdminLayout from './components/AdminLayout';
import AdminOverview from './pages/AdminOverview';
import AdminRoutes from './pages/AdminRoutes';
import AdminFleet from './pages/AdminFleet';
import AdminAlerts from './pages/AdminAlerts';

// Homeowner Flow
import HomeownerDashboard from './pages/HomeownerDashboard';

function AppLayout() {
  const location = useLocation();
  const isDesktopAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={clsx(
      "relative overflow-hidden bg-gray-bg",
      isDesktopAdmin 
        ? "flex h-screen w-full" 
        : "flex flex-col h-screen w-full max-w-md mx-auto shadow-xl"
    )}>
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/gateway" element={<Gateway />} />
          
          {/* Citizen Dedicated Flow */}
          <Route path="/citizen" element={<CitizenLayout />}>
            <Route index element={<Navigate to="map" replace />} />
            <Route path="map" element={<CitizenMap />} />
            <Route path="leaderboard" element={<CitizenLeaderboard />} />
            <Route path="rewards" element={<CitizenRewards />} />
            <Route path="profile" element={<CitizenProfile />} />
          </Route>

          {/* Enterprise Dedicated Flow (Mobile view) */}
          <Route path="/enterprise" element={<EnterpriseLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<EnterpriseDashboard />} />
            <Route path="routes" element={<EnterpriseRoutes />} />
            <Route path="fleet" element={<EnterpriseFleet />} />
            <Route path="alerts" element={<EnterpriseAlerts />} />
          </Route>

          {/* Desktop Admin Portal (Separated Website) */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="routes" element={<AdminRoutes />} />
            <Route path="fleet" element={<AdminFleet />} />
            <Route path="alerts" element={<AdminAlerts />} />
          </Route>

          <Route path="/homeowner" element={<HomeownerDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-200 flex items-center justify-center">
        <AppLayout />
      </div>
    </Router>
  );
}

export default App;
