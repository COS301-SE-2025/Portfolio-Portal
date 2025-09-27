import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import LandingPage from './pages/Landing';
import Profile from './pages/Profile';
import GitHubCallback from './pages/GitHubCallback';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggleButton from './components/ThemeToggleButton';
import Social from './pages/Social';

//FOR TESTING
import ForestPage from "./pages/ForestPage";
import ForestPage3D from "./pages/ForestPage3D";
import CavePage from "./pages/CavePage";
import LabPage from "./pages/LabPage";
import LabProPage from "./pages/LabProPage";
import Space from './pages/Space';
import SpacePage3D from './pages/SpacePage3D';
import OfficePage from './pages/OfficePage';
import Office3DPage from './pages/Office3DPage';
import CavePagev2 from './pages/CavePagev2';


const HIDDEN_NAVBAR_PATHS = [
  '/',
  '/login',
  '/register',
  '/office',
  '/office3d', 
  '/forest',
  '/forest3d',
  '/space',
  '/space3d',
  '/profile',
  '/lab',
  '/labpro',
  '/cave',
  '/github/callback',
  '/social',
  '/cavev2',

];

const HIDDEN_THEME_BUTTON_PATHS = [
  '/',
  '/office',
  '/office3d', 
  '/forest',
  '/forest3d',
  '/space',
  '/space3d',
  '/lab',
  '/labpro',
  '/cave',
  '/cavev2',
  '/github/callback',
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
          <Route path="/github/callback" element={<GitHubCallback />} />
          <Route path="/office" element={<OfficePage />} />
          <Route path="/office3d" element={<Office3DPage />} />
          <Route path="/forest" element={<ForestPage />} />
          <Route path="/forest3d" element={<ForestPage3D />} />
          <Route path="/lab" element={<LabPage />} />
          <Route path="/labpro" element={<LabProPage />} /> 
          <Route path="/profile" element={<Profile />} />
          <Route path="/cave" element={<CavePage />} />
          <Route path="/cavev2" element={<CavePagev2 />} />
          <Route path="/social" element={<Social />} />


          {/* Protected routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/space" element={<Space />} />
          <Route path="/space3d" element={<SpacePage3D />} />
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
