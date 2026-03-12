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

func GetComments(c *gin.Context) {
	dreamID := c.Param("dream_id")

	url := fmt.Sprintf("%s/rest/v1/comments?dream_id=eq.%s&order=created_at.desc",
		config.SupabaseURL, dreamID)

	req, _ := http.NewRequest("GET", url, nil)
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to fetch comments"})
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	var comments []models.Comment
	json.Unmarshal(body, &comments)

	c.JSON(http.StatusOK, gin.H{
		"comments": comments,
		"count":    len(comments),
	})
}

func AddComment(c *gin.Context) {
	var comment models.Comment
	if err := c.ShouldBindJSON(&comment); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	url := fmt.Sprintf("%s/rest/v1/comments", config.SupabaseURL)
	payload, _ := json.Marshal(comment)

	req, _ := http.NewRequest("POST", url, bytes.NewBuffer(payload))
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to add comment"})
		return
	}
	defer resp.Body.Close()

	c.JSON(http.StatusCreated, gin.H{"message": "Comment added successfully"})
}

func DeleteComment(c *gin.Context) {
	id := c.Param("id")

	url := fmt.Sprintf("%s/rest/v1/comments?id=eq.%s", config.SupabaseURL, id)

	req, _ := http.NewRequest("DELETE", url, nil)
	req.Header.Set("apikey", config.SupabaseServiceKey)
	req.Header.Set("Authorization", "Bearer "+config.SupabaseServiceKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete comment"})
		return
	}
	defer resp.Body.Close()

	c.JSON(http.StatusOK, gin.H{"message": "Comment deleted successfully"})
}
