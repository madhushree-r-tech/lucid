export default function DreamCard({ dream, onClick }) {
  const categoryColors = {
    Funny: 'bg-yellow-100 text-yellow-700',
    Scary: 'bg-red-100 text-red-700',
    Weird: 'bg-purple-100 text-purple-700',
    Romantic: 'bg-pink-100 text-pink-700',
    Adventure: 'bg-blue-100 text-blue-700',
  }

  const categoryEmojis = {
    Funny: '😂',
    Scary: '😱',
    Weird: '🌀',
    Romantic: '💕',
    Adventure: '🗺️',
  }

  return (
    <div
      onClick={onClick}
      className="break-inside-avoid mb-4 bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:shadow-lg hover:border-yellow-400 transition duration-300"
    >
      {/* Category Badge */}
      {dream.category && (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${categoryColors[dream.category]}`}>
          {categoryEmojis[dream.category]} {dream.category}
        </span>
      )}

      {/* Title */}
      <h3 className="text-lg font-bold text-black mb-2">
        {dream.title}
      </h3>

      {/* Content */}
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
        {dream.content}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-3 text-gray-400 text-sm">
          <span>❤️ {dream.reactions_count || 0}</span>
          <span>💬 {dream.comments_count || 0}</span>
          <span>🔗 {dream.shares_count || 0}</span>
        </div>
        {dream.is_anonymous ? (
          <span className="text-xs text-gray-400">Anonymous</span>
        ) : (
          <span className="text-xs text-gray-400">🌙 Dreamer</span>
        )}
      </div>
    </div>
  )
}