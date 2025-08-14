import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Space from './pages/Space';
import OfficePage from './pages/OfficePage';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import LandingPage from './pages/Landing';
import Profile from './pages/Profile';
import { ThemeProvider } from './contexts/ThemeContext';
import ThemeToggleButton from './components/ThemeToggleButton';

//FOR TESTING
import ForestPage from "./pages/ForestPage";

const HIDDEN_NAVBAR_PATHS = ['/', '/login', '/register', '/office', '/forest', '/space', '/profile'];
const HIDDEN_THEME_BUTTON_PATHS = []; // Add any paths where you don't want the theme button

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
          <Route path="/forest" element={<ForestPage />} />
          <Route path="/profile" element={<Profile />} />

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