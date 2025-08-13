import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Space from './pages/Space';
import OfficePage from './pages/OfficePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import LandingPage from './pages/Landing';
import { ThemeProvider } from './contexts/ThemeContext';

//FOR TESTING
import ForestPage from "./pages/ForestPage";
import LabPage from "./pages/LabPage";

const HIDDEN_NAVBAR_PATHS = ['/', '/login', '/register', '/office', '/forest', '/space', '/lab'];

function App() {
  const location = useLocation();
  const shouldHideNavbar = HIDDEN_NAVBAR_PATHS.includes(location.pathname);

  return (
    <ThemeProvider>
      <div className="min-h-screen">
        {!shouldHideNavbar && <Navbar />}
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/office" element={<OfficePage />} />
          <Route path="/forest" element={<ForestPage />} />
          <Route path="/lab" element={<LabPage />} />

          {/* Protected routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/space" element={<Space />} />

          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;