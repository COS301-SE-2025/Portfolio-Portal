import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<HomePage />} />
        {/* Add more routes as needed */}
      </Routes>
    </div>
  )
}

export default App