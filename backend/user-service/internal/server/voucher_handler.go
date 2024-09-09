package server

import (
	"brand-management-service/internal/model"
	"brand-management-service/internal/repository"
	"net/http"

	"github.com/gin-gonic/gin"
)

type ExchangeVoucherReq struct {
	UserID            int64 `json:"userId"`
	VoucherId         int64 `json:"voucherId"`
	VoucherQuantities int64 `json:"voucherQuantities"`
	Coin              int64 `json:"coin"`
	EventID           int64 `json:"eventId"`
}

func (s *Server) ExchangeVoucherHandler(c *gin.Context) {
	var req ExchangeVoucherReq
	if err := c.BindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	coin := model.Coin{
		UserID:  req.UserID,
		EventID: req.EventID,
		Coin:    req.Coin,
	}

	userVoucher := model.UserVoucher{
		UserID:            req.UserID,
		VoucherId:         req.VoucherId,
		VoucherQuantities: req.VoucherQuantities,
	}

	if err := repository.SubtractCoin(coin); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to subtract coins: " + err.Error()})
		return
	}

	if err := repository.AddVoucher(userVoucher); err != nil {
		if err := repository.AddCoin(coin); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to add coins: " + err.Error()})
			return
		}
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed to add voucher: " + err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Voucher exchanged successfully"})
}
