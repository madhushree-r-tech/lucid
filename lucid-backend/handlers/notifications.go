package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"lucid-backend/config"
	"lucid-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetNotifications(c *gin.Context) {
	userID := c.Query("user_id")
	if userID == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "user_id is required"})
		return
	}

	url := fmt.Sprintf("%s/rest/v1/notifications?user_id=eq.%s&order=created_at.desc&limit=20",
		config.SupabaseURL, userID)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch notifications"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var notifications []models.Notification
	json.Unmarshal(body, &notifications)

	c.JSON(http.StatusOK, gin.H{
		"notifications": notifications,
		"count":         len(notifications),
	})
}

func MarkNotificationRead(c *gin.Context) {
	id := c.Param("id")

	url := fmt.Sprintf("%s/rest/v1/notifications?id=eq.%s",
		config.SupabaseURL, id)

	payload := `{"is_read": true}`
	req, _ := http.NewRequest("PATCH", url,
		io.NopCloser(
			func() io.Reader {
				return nil
			}(),
		),
	)

	req, _ = http.NewRequest("PATCH", url, nil)
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)
	req.Header.Set("Content-Type", "application/json")
	req.Body = io.NopCloser(
		func() io.Reader {
			return nil
		}(),
	)

	_ = payload

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update notification"})
		return
	}
	defer resp.Body.Close()

	c.JSON(http.StatusOK, gin.H{"message": "Notification marked as read"})
}
