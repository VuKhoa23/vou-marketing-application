package main

import (
	"context"
	"fmt"
	"github.com/segmentio/kafka-go"
	"log"
	"validate-answer-service/internal/server"
)

func main() {
	go func() {

		r := kafka.NewReader(kafka.ReaderConfig{
			Brokers:   []string{"localhost:9092"},
			Topic:     "user-answers",
			Partition: 0,
			MaxBytes:  10e6, // 10MB
		})

		for {
			fmt.Println("listening")
			m, err := r.ReadMessage(context.Background())
			if err != nil {
				break
			}
			fmt.Printf("message at offset %d: %s = %s\n", m.Offset, string(m.Key), string(m.Value))
		}

		if err := r.Close(); err != nil {
			log.Fatal("failed to close reader:", err)
		}
	}()

	server := server.NewServer()

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}

}
