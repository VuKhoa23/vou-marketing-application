package dto

type EventAndVoucherDTO struct {
	Event   EventDTO   `json:"event"`
	Voucher VoucherDTO `json:"voucher"`
}
