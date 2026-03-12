package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"lucid-backend/config"
	"lucid-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func FollowUser(c *gin.Context) {
	var follow models.Follow
	if err := c.ShouldBindJSON(&follow); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url := fmt.Sprintf("%s/rest/v1/follows", config.SupabaseURL)
	payload, _ := json.Marshal(follow)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to follow user"})
		return
	}
	defer resp.Body.Close()

	c.JSON(http.StatusCreated, gin.H{"message": "User followed successfully"})
}

func UnfollowUser(c *gin.Context) {
	id := c.Param("id")

	url := fmt.Sprintf("%s/rest/v1/follows?id=eq.%s", config.SupabaseURL, id)

	req, _ := http.NewRequest("DELETE", url, nil)
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to unfollow user"})
		return
	}
	defer resp.Body.Close()

	c.JSON(http.StatusOK, gin.H{"message": "User unfollowed successfully"})
}
