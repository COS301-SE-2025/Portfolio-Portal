import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import LandingPage from './pages/Landing';
import Profile from './pages/Profile';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import ThemeToggleButton from './components/ThemeToggleButton';
import Social from './pages/Social';
import ProtectedRoute from './components/ProtectedRoute';

//TEMPLATES:
import ForestPage from "./pages/ForestPage";
import ForestPage3D from "./pages/ForestPage3D";
import LabProPage from "./pages/LabProPage";
import LabPage from "./pages/LabPage";
import Space from './pages/Space';
import SpacePage3D from './pages/SpacePage3D';
import OfficePage from './pages/OfficePage';
import Office3DPage from './pages/Office3DPage';
import CavePage from './pages/CavePage';
import CavePage3D from "./pages/CavePage3D";
import CavePagev2 from "./pages/CavePagev2";

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
  '/social',
  '/cave',
  '/cavev2',
  '/cave3d',
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
  '/cave3d',
];

function App() {
  const location = useLocation();
  const shouldHideNavbar = HIDDEN_NAVBAR_PATHS.includes(location.pathname);
  const shouldHideThemeButton = HIDDEN_THEME_BUTTON_PATHS.includes(location.pathname);

  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen">
          {!shouldHideNavbar && <Navbar />}
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected routes */}
            <Route path="/home" element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } />
            
            <Route path="/social" element={
              <ProtectedRoute>
                <Social />
              </ProtectedRoute>
            } />
            
            <Route path="/office" element={
              <ProtectedRoute>
                <OfficePage />
              </ProtectedRoute>
            } />
            
            <Route path="/office3d" element={
              <ProtectedRoute>
                <Office3DPage />
              </ProtectedRoute>
            } />
            
            <Route path="/forest" element={
              <ProtectedRoute>
                <ForestPage />
              </ProtectedRoute>
            } />
            
            <Route path="/forest3d" element={
              <ProtectedRoute>
                <ForestPage3D />
              </ProtectedRoute>
            } />
            
            <Route path="/lab" element={
              <ProtectedRoute>
                <LabPage />
              </ProtectedRoute>
            } />
            
            <Route path="/labpro" element={
              <ProtectedRoute>
                <LabProPage />
              </ProtectedRoute>
            } />
            
            <Route path="/cave3d" element={
              <ProtectedRoute>
                <CavePage3D />
              </ProtectedRoute>
            } />

            <Route path="/cavev2" element={
              <ProtectedRoute>
                <CavePagev2 />
              </ProtectedRoute>
            } />

            <Route path="/cave" element={
              <ProtectedRoute>
                <CavePage />
              </ProtectedRoute>
            } />

            <Route path="/space" element={
              <ProtectedRoute>
                <Space />
              </ProtectedRoute>
            } />
            
            <Route path="/space3d" element={
              <ProtectedRoute>
                <SpacePage3D />
              </ProtectedRoute>
            } />

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
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;