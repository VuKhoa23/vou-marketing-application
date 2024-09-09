package model

type UserVoucher struct {
	UserID            int64 `json:"userId"`
	VoucherId         int64 `json:"voucherId"`
	VoucherQuantities int64 `json:"voucherQuantities"`
}
