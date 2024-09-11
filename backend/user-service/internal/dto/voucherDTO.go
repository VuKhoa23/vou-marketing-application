package dto

type VoucherDTO struct {
	VoucherId          int     `json:"voucherId"`
	VoucherImageURL    string  `json:"voucherImageURL"`
	VoucherValue       float64 `json:"voucherValue"`
	VoucherDescription string  `json:"voucherDescription"`
	VoucherQuantities  int     `json:"voucherQuantities"`
	VoucherLeft        int     `json:"voucherLeft"`
	VoucherEndDate     int64   `json:"voucherEndDate"`
	VoucherStatus      bool    `json:"voucherStatus"`
}
