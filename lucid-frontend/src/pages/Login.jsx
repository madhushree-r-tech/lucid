import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-black">Lucid</h1>
          <p className="text-gray-500 mt-2">Enter the dream world</p>
        </div>

        {/* Form */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-black mb-6">Welcome back</h2>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition"
                placeholder="••••••••"
              />
            </div>

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-yellow-500 hover:text-black transition duration-300"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>

          <p className="text-center text-gray-500 mt-6 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-yellow-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}