import { useState, useEffect } from 'react'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useNavigate } from 'react-router-dom'

export default function Leaderboard() {
  const [dreams, setDreams] = useState([])
  const [period, setPeriod] = useState('daily')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchLeaderboard()
  }, [period])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/leaderboard/${period}`
      )
      setDreams(res.data.dreams || [])
    } catch (err) {
      console.error('Failed to fetch leaderboard', err)
    }
    setLoading(false)
  }

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black">🏆 Leaderboard</h1>
          <p className="text-gray-500 mt-2">Top dreams of the {period}</p>
        </div>

        {/* Period Toggle */}
        <div className="flex bg-white border border-gray-200 rounded-xl p-1 mb-8">
          <button
            onClick={() => setPeriod('daily')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
              period === 'daily'
                ? 'bg-black text-white'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Daily
          </button>
          <button
            onClick={() => setPeriod('weekly')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
              period === 'weekly'
                ? 'bg-black text-white'
                : 'text-gray-500 hover:text-black'
            }`}
          >
            Weekly
          </button>
        </div>

        {/* Leaderboard List */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Loading leaderboard...
          </div>
        ) : dreams.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🌙</p>
            <p className="text-gray-400">No dreams yet this {period}!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {dreams.map((dream, index) => (
              <div
                key={dream.id}
                onClick={() => navigate(`/dream/${dream.id}`)}
                className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:border-yellow-400 transition duration-300 flex items-center gap-4"
              >
                {/* Rank */}
                <div className="text-3xl w-10 text-center">
                  {medals[index] || `#${index + 1}`}
                </div>

                {/* Dream Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-black">{dream.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-1 mt-1">
                    {dream.content}
                  </p>
                  <div className="flex gap-3 mt-2 text-xs text-gray-400">
                    <span>❤️ {dream.reactions_count || 0}</span>
                    <span>💬 {dream.comments_count || 0}</span>
                    <span>⭐ Score: {dream.score || 0}</span>
                  </div>
                </div>

                {/* Category */}
                <span className="text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full font-semibold">
                  {dream.category}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}