package models

import "time"

type Dream struct {
	ID             string    `json:"id"`
	UserID         string    `json:"user_id"`
	Title          string    `json:"title"`
	Content        string    `json:"content"`
	Category       string    `json:"category"`
	IsAnonymous    bool      `json:"is_anonymous"`
	ReactionsCount int       `json:"reactions_count"`
	CommentsCount  int       `json:"comments_count"`
	SharesCount    int       `json:"shares_count"`
	Score          int       `json:"score"`
	CreatedAt      time.Time `json:"created_at"`
}

type Profile struct {
	ID             string    `json:"id"`
	Username       string    `json:"username"`
	FullName       string    `json:"full_name"`
	AvatarURL      string    `json:"avatar_url"`
	Bio            string    `json:"bio"`
	FollowersCount int       `json:"followers_count"`
	FollowingCount int       `json:"following_count"`
	DreamsCount    int       `json:"dreams_count"`
	CreatedAt      time.Time `json:"created_at"`
}

type Reaction struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	DreamID   string    `json:"dream_id"`
	Type      string    `json:"type"`
	CreatedAt time.Time `json:"created_at"`
}

type Comment struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	DreamID   string    `json:"dream_id"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}

type Notification struct {
	ID         string    `json:"id"`
	UserID     string    `json:"user_id"`
	FromUserID string    `json:"from_user_id"`
	Type       string    `json:"type"`
	DreamID    string    `json:"dream_id"`
	IsRead     bool      `json:"is_read"`
	CreatedAt  time.Time `json:"created_at"`
}
type Follow struct {
	ID          string    `json:"id"`
	FollowerID  string    `json:"follower_id"`
	FollowingID string    `json:"following_id"`
	CreatedAt   time.Time `json:"created_at"`
}
