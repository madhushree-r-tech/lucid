package handlers

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"lucid-backend/config"
	"lucid-backend/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetProfile(c *gin.Context) {
	id := c.Param("id")

	url := fmt.Sprintf("%s/rest/v1/profiles?id=eq.%s", config.SupabaseURL, id)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch profile"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var profiles []models.Profile
	json.Unmarshal(body, &profiles)

	if len(profiles) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Profile not found"})
		return
	}

	c.JSON(http.StatusOK, profiles[0])
}

func UpdateProfile(c *gin.Context) {
	id := c.Param("id")

	var profile models.Profile
	if err := c.ShouldBindJSON(&profile); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url := fmt.Sprintf("%s/rest/v1/profiles?id=eq.%s", config.SupabaseURL, id)
	payload, _ := json.Marshal(profile)

	req, _ := http.NewRequest("PATCH", url, bytes.NewBuffer(payload))
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile"})
		return
	}
	defer resp.Body.Close()

	c.JSON(http.StatusOK, gin.H{"message": "Profile updated successfully"})
}
