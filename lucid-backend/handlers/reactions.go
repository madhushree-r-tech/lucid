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

func AddReaction(c *gin.Context) {
	var reaction models.Reaction
	if err := c.ShouldBindJSON(&reaction); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url := fmt.Sprintf("%s/rest/v1/reactions", config.SupabaseURL)
	payload, _ := json.Marshal(reaction)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add reaction"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	_ = body

	c.JSON(http.StatusCreated, gin.H{"message": "Reaction added successfully"})
}

func RemoveReaction(c *gin.Context) {
	id := c.Param("id")

	url := fmt.Sprintf("%s/rest/v1/reactions?id=eq.%s", config.SupabaseURL, id)

	req, _ := http.NewRequest("DELETE", url, nil)
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to remove reaction"})
		return
	}
	defer resp.Body.Close()

	c.JSON(http.StatusOK, gin.H{"message": "Reaction removed successfully"})
}
