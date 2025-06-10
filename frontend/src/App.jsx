import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Space from './pages/Space';
import Login from './pages/Login';
import Register from './pages/Register';
import Navbar from './components/Navbar';
import LandingPage from './pages/Landing';
import Profile from './pages/Profile';
import { ThemeProvider } from './contexts/ThemeContext';

const HIDDEN_NAVBAR_PATHS = ['/', '/login', '/register'];

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

          {/* Protected routes */}

            <Route path="/home" element={<Home />} />
            <Route path="/space" element={<Space />} />
            <Route path="/profile" element={<Profile />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;