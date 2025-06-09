import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Space from './pages/Space'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar'
import LandingPage from './pages/Landing'
import Profile from './pages/Profile'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const location = useLocation()
  
  const hideNavbar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/space' || location.pathname === '/profile'

  return (    
    <ThemeProvider>
      <div>
        {!hideNavbar && <Navbar />}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/space" element={<Space />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>

      </div>
    </ThemeProvider>
  )
}

export default App