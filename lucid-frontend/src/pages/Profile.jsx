import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import DreamCard from '../components/DreamCard'

export default function Profile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [dreams, setDreams] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState(null)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    fetchProfile()
    fetchUserDreams()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null)
    })
  }, [id])

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/profiles/${id}`
      )
      setProfile(res.data)
    } catch (err) {
      console.error('Failed to fetch profile', err)
    }
    setLoading(false)
  }

  const fetchUserDreams = async () => {
    try {
      const { data } = await supabase
        .from('dreams')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false })
      setDreams(data || [])
    } catch (err) {
      console.error('Failed to fetch dreams', err)
    }
  }

  const handleFollow = async () => {
    if (!currentUser) {
      navigate('/login')
      return
    }

    try {
      if (isFollowing) {
        await axios.delete(
          `${import.meta.env.VITE_API_URL}/api/follows/${id}`
        )
        setIsFollowing(false)
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/api/follows`, {
          follower_id: currentUser.id,
          following_id: id,
        })
        setIsFollowing(true)
      }
      fetchProfile()
    } catch (err) {
      console.error('Failed to follow/unfollow', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading profile...</p>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Profile not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 pt-24 pb-12">

        {/* Profile Header */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">

              {/* Avatar */}
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {profile.username?.[0]?.toUpperCase() || '🌙'}
              </div>

              {/* Info */}
              <div>
                <h1 className="text-2xl font-bold text-black">
                  @{profile.username}
                </h1>
                {profile.full_name && (
                  <p className="text-gray-500">{profile.full_name}</p>
                )}
                {profile.bio && (
                  <p className="text-gray-600 mt-1 text-sm">{profile.bio}</p>
                )}
              </div>
            </div>

            {/* Follow Button */}
            {currentUser && currentUser.id !== id && (
              <button
                onClick={handleFollow}
                className={`px-6 py-2 rounded-xl font-semibold transition duration-300 ${
                  isFollowing
                    ? 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                    : 'bg-black text-white hover:bg-yellow-500 hover:text-black'
                }`}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex gap-8 mt-6 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-black">
                {dreams.length}
              </p>
              <p className="text-gray-500 text-sm">Dreams</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-black">
                {profile.followers_count || 0}
              </p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-black">
                {profile.following_count || 0}
              </p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
          </div>
        </div>

        {/* User Dreams */}
        <h2 className="text-xl font-bold text-black mb-4">
          Dreams 🌙
        </h2>

        {dreams.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🌙</p>
            <p className="text-gray-400">No dreams posted yet!</p>
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
    </div>
  )
}