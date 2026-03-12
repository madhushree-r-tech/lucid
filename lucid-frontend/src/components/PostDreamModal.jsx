import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function PostDreamModal({ onClose, onPosted }) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('Funny')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePost = async () => {
    if (!title || !content) {
      setError('Please fill in all fields')
      return
    }

    setLoading(true)
    setError('')

    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      setError('You must be logged in to post a dream')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('dreams').insert({
      user_id: session.user.id,
      title,
      content,
      category,
      is_anonymous: isAnonymous,
      score: 0,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    onPosted()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black bg-opacity-50"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <h2 className="text-2xl font-bold text-black mb-6">
          Share your dream 🌙
        </h2>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dream Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition"
              placeholder="Give your dream a title..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dream Story
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition resize-none"
              placeholder="Describe your dream in detail..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-yellow-500 transition"
            >
              <option value="Funny">😂 Funny</option>
              <option value="Scary">😱 Scary</option>
              <option value="Weird">🌀 Weird</option>
              <option value="Romantic">💕 Romantic</option>
              <option value="Adventure">🗺️ Adventure</option>
            </select>
          </div>

          {/* Anonymous Toggle */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="anonymous"
              checked={isAnonymous}
              onChange={(e) => setIsAnonymous(e.target.checked)}
              className="w-4 h-4 accent-yellow-500"
            />
            <label htmlFor="anonymous" className="text-sm text-gray-600">
              Post anonymously
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-3 border border-gray-200 rounded-xl font-semibold text-gray-600 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={handlePost}
              disabled={loading}
              className="flex-1 py-3 bg-black text-white rounded-xl font-semibold hover:bg-yellow-500 hover:text-black transition duration-300"
            >
              {loading ? 'Posting...' : 'Post Dream'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}