import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Space from './pages/Space'
import Login from './pages/Login'
import Register from './pages/Register'
import Templates from './pages/Templates'
import Navbar from './components/Navbar' // Adjust path as needed
import { ThemeProvider } from './contexts/ThemeContext'
function App() {
  const location = useLocation()
  
  // Hide navbar on login and register pages
  const hideNavbar = location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/space'

  return (
    <ThemeProvider>
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/space" element={<Space />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/templates" element={<Templates />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
    </ThemeProvider>
  )
}

export default App