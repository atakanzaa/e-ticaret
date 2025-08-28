#!/bin/bash

# E-Ticaret Kafka Topics Initialization Script
# Bu script sistemde kullanılacak topic'leri oluşturur

echo "Kafka topic'leri oluşturuluyor..."

# Wait for Kafka to be ready
sleep 30

# Create topics for e-commerce system
kafka-topics --create --topic order.created --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --create --topic payment.succeeded --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists  
kafka-topics --create --topic payment.failed --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --create --topic product.updated --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --create --topic store.updated --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --create --topic review.approved --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --create --topic user.registered --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists
kafka-topics --create --topic inventory.updated --bootstrap-server localhost:9092 --partitions 3 --replication-factor 1 --if-not-exists

echo "E-Ticaret Kafka topic'leri başarıyla oluşturuldu!"

# List created topics
kafka-topics --list --bootstrap-server localhost:9092
