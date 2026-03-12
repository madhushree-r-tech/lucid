import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'

export default function DreamDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [dream, setDream] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchDream()
    fetchComments()
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
  }, [id])

  const fetchDream = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/dreams/${id}`
      )
      setDream(res.data)
    } catch (err) {
      console.error('Failed to fetch dream', err)
    }
    setLoading(false)
  }

  const fetchComments = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/comments/${id}`
      )
      setComments(res.data.comments || [])
    } catch (err) {
      console.error('Failed to fetch comments', err)
    }
  }

  const handleComment = async () => {
    if (!newComment) return
    if (!user) {
      navigate('/login')
      return
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/comments`, {
        user_id: user.id,
        dream_id: id,
        content: newComment,
      })
      setNewComment('')
      fetchComments()
    } catch (err) {
      console.error('Failed to add comment', err)
    }
  }

  const handleReaction = async (type) => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/reactions`, {
        user_id: user.id,
        dream_id: id,
        type,
      })
      fetchDream()
    } catch (err) {
      console.error('Failed to add reaction', err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading dream...</p>
      </div>
    )
  }

  if (!dream) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Dream not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">

        {/* Dream Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm mb-6">
          <span className="inline-block bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold mb-4">
            {dream.category}
          </span>

          <h1 className="text-3xl font-bold text-black mb-4">
            {dream.title}
          </h1>

          <p className="text-gray-600 leading-relaxed mb-6">
            {dream.content}
          </p>

          {/* Reactions */}
          <div className="flex gap-3 flex-wrap">
            {['Funny', 'Scary', 'Weird', 'Romantic', 'Adventure'].map((type) => (
              <button
                key={type}
                onClick={() => handleReaction(type)}
                className="px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium hover:border-yellow-400 hover:bg-yellow-50 transition"
              >
                {type === 'Funny' && '😂'}
                {type === 'Scary' && '😱'}
                {type === 'Weird' && '🌀'}
                {type === 'Romantic' && '💕'}
                {type === 'Adventure' && '🗺️'}
                {' '}{type}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-4 text-sm text-gray-400">
            <span>❤️ {dream.reactions_count || 0} reactions</span>
            <span>💬 {dream.comments_count || 0} comments</span>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-black mb-4">
            Comments ({comments.length})
          </h2>

          {/* Add Comment */}
          <div className="flex gap-3 mb-6">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition text-sm"
              placeholder="Share your thoughts..."
            />
            <button
              onClick={handleComment}
              className="bg-black text-white px-5 py-3 rounded-xl text-sm font-semibold hover:bg-yellow-500 hover:text-black transition duration-300"
            >
              Post
            </button>
          </div>

          {/* Comments List */}
          {comments.length === 0 ? (
            <p className="text-gray-400 text-sm text-center py-4">
              No comments yet. Be the first!
            </p>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-100 pb-4">
                  <p className="text-sm text-gray-600">{comment.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(comment.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}