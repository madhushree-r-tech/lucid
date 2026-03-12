package main

import (
	"log"
	"lucid-backend/config"
	"lucid-backend/routes"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load environment variables
	config.Load()

	// Create Gin router
	r := gin.Default()

	// Setup CORS
	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		AllowCredentials: true,
	}))

	// Register all routes
	routes.Register(r)

	// Start server
	log.Println("🚀 Lucid backend running on port " + config.Port)
	r.Run(":" + config.Port)
}
