package routes

import (
	"lucid-backend/handlers"

	"github.com/gin-gonic/gin"
)

func Register(r *gin.Engine) {
	api := r.Group("/api")
	{
		// Feed routes
		api.GET("/feed/trending", handlers.GetTrendingFeed)
		api.GET("/feed/random", handlers.GetRandomFeed)

		// Dream routes
		api.GET("/dreams/:id", handlers.GetDream)
		api.POST("/dreams", handlers.CreateDream)
		api.DELETE("/dreams/:id", handlers.DeleteDream)

		// Reaction routes
		api.POST("/reactions", handlers.AddReaction)
		api.DELETE("/reactions/:id", handlers.RemoveReaction)

		// Comment routes
		api.GET("/comments/:dream_id", handlers.GetComments)
		api.POST("/comments", handlers.AddComment)
		api.DELETE("/comments/:id", handlers.DeleteComment)

		// Follow routes
		api.POST("/follows", handlers.FollowUser)
		api.DELETE("/follows/:id", handlers.UnfollowUser)

		// Leaderboard routes
		api.GET("/leaderboard/daily", handlers.GetDailyLeaderboard)
		api.GET("/leaderboard/weekly", handlers.GetWeeklyLeaderboard)

		// Notification routes
		api.GET("/notifications", handlers.GetNotifications)
		api.PUT("/notifications/:id/read", handlers.MarkNotificationRead)

		// Profile routes
		api.GET("/profiles/:id", handlers.GetProfile)
		api.PUT("/profiles/:id", handlers.UpdateProfile)
	}
}
