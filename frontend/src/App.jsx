import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import OfficePage from './pages/OfficePage';
import Office3DPage from './pages/Office3DPage'
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import LandingPage from './pages/Landing';
import Profile from './pages/Profile';
import Social from './pages/Social';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggleButton from './components/ThemeToggleButton';


//FOR TESTING
import ForestPage from "./pages/ForestPage";
import CavePage from "./pages/CavePage";
import LabPage from "./pages/LabPage";
import Space from './pages/Space';
import CavePagev2 from './pages/CavePagev2';

const HIDDEN_NAVBAR_PATHS = [
  '/',
  '/login',
  '/register',
  '/office',
  '/office3d', 
  '/forest',
  '/space',
  '/profile',
  '/lab',
  '/cave',
  '/cavev2',
 '/social',
];

const HIDDEN_THEME_BUTTON_PATHS = [
  '/',
  '/office',
  '/office3d', 
  '/forest',
  '/space',
  '/lab',
  '/cave',
  '/cavev2',
  
];

function App() {
  const location = useLocation();
  const shouldHideNavbar = HIDDEN_NAVBAR_PATHS.includes(location.pathname);
  const shouldHideThemeButton = HIDDEN_THEME_BUTTON_PATHS.includes(location.pathname);

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
          <Route path="/office3d" element={<Office3DPage />} />
          <Route path="/forest" element={<ForestPage />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cave" element={<CavePage />} />
          <Route path="/cavev2" element={<CavePagev2 />} />
          <Route path="/social" element={<Social />} />
          {/* Protected routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/space" element={<Space />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Theme Toggle Button - Single instance for the whole app */}
        {!shouldHideThemeButton && (
          <div className="fixed bottom-4 left-4 z-50">
            <ThemeToggleButton />
          </div>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;