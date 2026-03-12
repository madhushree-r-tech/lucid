package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"lucid-backend/config"
	"lucid-backend/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func GetDailyLeaderboard(c *gin.Context) {
	since := time.Now().Add(-24 * time.Hour).Format(time.RFC3339)

	url := fmt.Sprintf("%s/rest/v1/dreams?created_at=gte.%s&order=score.desc&limit=10",
		config.SupabaseURL, since)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch leaderboard"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var dreams []models.Dream
	json.Unmarshal(body, &dreams)

	c.JSON(http.StatusOK, gin.H{
		"period": "daily",
		"dreams": dreams,
	})
}

func GetWeeklyLeaderboard(c *gin.Context) {
	since := time.Now().Add(-7 * 24 * time.Hour).Format(time.RFC3339)

	url := fmt.Sprintf("%s/rest/v1/dreams?created_at=gte.%s&order=score.desc&limit=10",
		config.SupabaseURL, since)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch leaderboard"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var dreams []models.Dream
	json.Unmarshal(body, &dreams)

	c.JSON(http.StatusOK, gin.H{
		"period": "weekly",
		"dreams": dreams,
	})
}
