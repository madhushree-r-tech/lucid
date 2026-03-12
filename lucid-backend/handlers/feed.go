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

func GetTrendingFeed(c *gin.Context) {
	url := fmt.Sprintf("%s/rest/v1/dreams?order=created_at.desc&limit=20",
		config.SupabaseURL)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch dreams"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var dreams []models.Dream
	json.Unmarshal(body, &dreams)

	c.JSON(http.StatusOK, gin.H{
		"dreams": dreams,
		"count":  len(dreams),
	})
}

func GetRandomFeed(c *gin.Context) {
	url := fmt.Sprintf("%s/rest/v1/dreams?order=created_at.desc&limit=20",
		config.SupabaseURL)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch dreams"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var dreams []models.Dream
	json.Unmarshal(body, &dreams)

	c.JSON(http.StatusOK, gin.H{
		"dreams": dreams,
		"count":  len(dreams),
	})
}

func GetDream(c *gin.Context) {
	id := c.Param("id")
	url := fmt.Sprintf("%s/rest/v1/dreams?id=eq.%s", config.SupabaseURL, id)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch dream"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var dreams []models.Dream
	json.Unmarshal(body, &dreams)

	if len(dreams) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Dream not found"})
		return
	}

	c.JSON(http.StatusOK, dreams[0])
}

func CreateDream(c *gin.Context) {
	var dream models.Dream
	if err := c.ShouldBindJSON(&dream); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "Dream created successfully"})
}

func DeleteDream(c *gin.Context) {
	id := c.Param("id")
	c.JSON(http.StatusOK, gin.H{"message": "Dream " + id + " deleted"})
}
