package server

import (
	"brand-management-service/internal/model"
	"brand-management-service/internal/repository"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

type ExchangeVoucherReq struct {
	VoucherID         int64 `json:"voucherId"`
	VoucherQuantities int64 `json:"voucherQuantities"`
	Coin              int64 `json:"coin"`
	EventID           int64 `json:"eventId"`
}

func (s *Server) ExchangeVoucherHandler(c *gin.Context) {
	var req ExchangeVoucherReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	userId, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{
			"message": "unauthorized",
		})
		return
	}

	// Convert userId to int64 if it's an int16
	var userIdInt64 int64
	switch id := userId.(type) {
	case int64:
		userIdInt64 = id
	case int16:
		userIdInt64 = int64(id) // Convert int16 to int64
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
		return
	}

	coin := model.Coin{
		UserID:  userIdInt64,
		EventID: req.EventID,
		Coin:    req.Coin,
	}

	userVoucher := model.UserVoucher{
		UserID:            userIdInt64,
		VoucherID:         req.VoucherID,
		VoucherQuantities: req.VoucherQuantities,
	}

	if err := repository.SubtractCoin(coin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	if err := repository.AddVoucher(userVoucher); err != nil {
		if err := repository.AddCoin(coin); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Voucher exchanged successfully"})
}

func (s *Server) GetVouchersHandler(c *gin.Context) {
	userID, exists := c.Get("id")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"message": "Unauthorized"})
		return
	}

	// Convert userID to int64 if necessary
	var userIDInt64 int64
	switch id := userID.(type) {
	case int64:
		userIDInt64 = id
	case int16:
		userIDInt64 = int64(id)
	default:
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Invalid user ID type"})
		return
	}

	voucherIDStr := c.Query("voucherId")
	voucherID, err := strconv.ParseInt(voucherIDStr, 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid voucherId"})
		return
	}

	voucherAmount, err := repository.ShowVoucher(userIDInt64, voucherID)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"error":   "Failed to retrieve coins",
			"message": err,
		})
		return
	}

	c.JSON(http.StatusOK, gin.H{"voucher quantities": voucherAmount})
}
