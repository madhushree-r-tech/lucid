import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import DreamCard from '../components/DreamCard'
import PostDreamModal from '../components/PostDreamModal'

export default function Home() {
  const [dreams, setDreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [feed, setFeed] = useState('trending')
  const [showModal, setShowModal] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    fetchDreams()
  }, [feed])

  const fetchDreams = async () => {
    setLoading(true)
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/feed/${feed}`
      )
      setDreams(res.data.dreams || [])
    } catch (err) {
      console.error('Failed to fetch dreams', err)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 pt-24 pb-8">
        <div className="flex items-center justify-between mb-8">

          {/* Feed Toggle */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setFeed('trending')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                feed === 'trending'
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              🔥 Trending
            </button>
            <button
              onClick={() => setFeed('random')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition ${
                feed === 'random'
                  ? 'bg-black text-white'
                  : 'text-gray-500 hover:text-black'
              }`}
            >
              🌀 Random
            </button>
          </div>

          {/* Post Dream Button */}
          <button
            onClick={() => setShowModal(true)}
            className="bg-black text-white px-6 py-2 rounded-xl font-semibold hover:bg-yellow-500 hover:text-black transition duration-300"
          >
            + Post Dream
          </button>
        </div>

        {/* Dream Grid */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Loading dreams...
          </div>
        ) : dreams.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-white">✦</span>
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">
              No dreams yet
            </h2>
            <p className="text-gray-400 mb-6">
              Be the first to share your dream with the world
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-yellow-500 hover:text-black transition duration-300"
            >
              Share your first dream
            </button>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
            {dreams.map((dream) => (
              <DreamCard
                key={dream.id}
                dream={dream}
                onClick={() => navigate(`/dream/${dream.id}`)}
              />
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <PostDreamModal
          onClose={() => setShowModal(false)}
          onPosted={fetchDreams}
        />
      )}
    </div>
  )
}