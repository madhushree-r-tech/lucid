package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

var (
	SupabaseURL        string
	SupabaseServiceKey string
	JWTSecret          string
	Port               string
)

func Load() {
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	SupabaseURL = os.Getenv("SUPABASE_URL")
	SupabaseServiceKey = os.Getenv("SUPABASE_SERVICE_KEY")
	JWTSecret = os.Getenv("SUPABASE_JWT_SECRET")
	Port = os.Getenv("PORT")

	if Port == "" {
		Port = "8080"
	}
}
