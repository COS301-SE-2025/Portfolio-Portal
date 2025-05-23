import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Upload from './pages/Upload'
import Space from './pages/Space'
import Login from './pages/Login'
import Register from './pages/Register'
import Navbar from './components/Navbar' // Adjust path as needed

function App() {
  const location = useLocation()
  
  // Hide navbar on login and register pages
  const hideNavbar = location.pathname === '/login' || location.pathname === '/register'

  return (
    <div>
      {!hideNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/space" element={<Space />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App