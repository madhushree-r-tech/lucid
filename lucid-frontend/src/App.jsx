import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import DreamDetail from './pages/DreamDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile/:id" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/dream/:id" element={<DreamDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App