import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Navbar() {
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-black">
          Lucid
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-black font-medium transition"
          >
            Feed
          </Link>
          <Link
            to="/leaderboard"
            className="text-gray-600 hover:text-black font-medium transition"
          >
            🏆 Leaderboard
          </Link>

          {user ? (
            <div className="flex items-center gap-4">
              <Link
                to="/notifications"
                className="text-gray-600 hover:text-black font-medium transition"
              >
                🔔
              </Link>
              <Link
                to={`/profile/${user.id}`}
                className="text-gray-600 hover:text-black font-medium transition"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-500 hover:text-black transition duration-300"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-gray-600 hover:text-black font-medium transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-black text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-yellow-500 hover:text-black transition duration-300"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}