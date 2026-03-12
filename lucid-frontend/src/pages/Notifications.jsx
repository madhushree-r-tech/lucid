import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate('/login')
        return
      }
      setUser(session.user)
      fetchNotifications(session.user.id)
    })
  }, [])

  const fetchNotifications = async (userId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/notifications?user_id=${userId}`
      )
      setNotifications(res.data.notifications || [])
    } catch (err) {
      console.error('Failed to fetch notifications', err)
    }
    setLoading(false)
  }

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/notifications/${id}/read`
      )
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ))
    } catch (err) {
      console.error('Failed to mark notification as read', err)
    }
  }

  const getNotificationText = (type) => {
    switch (type) {
      case 'reaction': return 'reacted to your dream'
      case 'comment': return 'commented on your dream'
      case 'follow': return 'started following you'
      default: return 'interacted with you'
    }
  }

  const getNotificationEmoji = (type) => {
    switch (type) {
      case 'reaction': return '❤️'
      case 'comment': return '💬'
      case 'follow': return '👤'
      default: return '🔔'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 pt-24 pb-12">

        {/* Header */}
        <h1 className="text-3xl font-bold text-black mb-8">
          🔔 Notifications
        </h1>

        {loading ? (
          <div className="text-center py-20 text-gray-400">
            Loading notifications...
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-black rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-4xl text-white">🔔</span>
            </div>
            <h2 className="text-2xl font-bold text-black mb-2">
              No notifications yet
            </h2>
            <p className="text-gray-400">
              When someone reacts or comments on your dream you'll see it here!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => markAsRead(notification.id)}
                className={`bg-white border rounded-2xl p-5 cursor-pointer transition duration-300 hover:shadow-md ${
                  notification.is_read
                    ? 'border-gray-200'
                    : 'border-yellow-400 bg-yellow-50'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-lg">
                    {getNotificationEmoji(notification.type)}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">
                      Someone {getNotificationText(notification.type)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notification.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {!notification.is_read && (
                    <div className="ml-auto w-2 h-2 bg-yellow-500 rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}