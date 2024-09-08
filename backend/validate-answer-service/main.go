package main

import (
	"context"
	"fmt"
	"github.com/segmentio/kafka-go"
	"log"
	"os"
	"time"
	"validate-answer-service/internal/server"
)

func main() {
	kafkaUrl := os.Getenv("KAFKA_URL")
	go func() {
		for {
			var r *kafka.Reader

			for {
				fmt.Println("Waiting..")
				r = kafka.NewReader(kafka.ReaderConfig{
					Brokers:   []string{kafkaUrl},
					Topic:     "user-answers",
					Partition: 0,
					MaxBytes:  10e6, // 10MB
					MaxWait:   1 * time.Second,
				})
				m, err := r.ReadMessage(context.Background())
				if err == nil {
					fmt.Println("Connected")
					fmt.Printf("message at offset %d: %s = %s\n", m.Offset, string(m.Key), string(m.Value))
					break
				}
				time.Sleep(1 * time.Second)
			}

			for {
				m, err := r.ReadMessage(context.Background())
				if err != nil {
					fmt.Println("Error reading message:", err)
					break
				}
				fmt.Printf("message at offset %d: %s = %s\n", m.Offset, string(m.Key), string(m.Value))
			}

			if err := r.Close(); err != nil {
				log.Fatal("failed to close reader:", err)
			}
		}

	}()

	server := server.NewServer()

	err := server.ListenAndServe()
	if err != nil {
		panic(fmt.Sprintf("cannot start server: %s", err))
	}

}
