#!/bin/bash

# E-Ticaret MinIO Initialization Script

echo "Initializing E-Ticaret MinIO buckets..."

# Wait for MinIO to start
sleep 10

# Create buckets for e-commerce system
mc alias set myminio http://localhost:9000 minioadmin minioadmin123

# Create buckets
mc mb myminio/product-images --ignore-existing
mc mb myminio/user-avatars --ignore-existing
mc mb myminio/store-banners --ignore-existing
mc mb myminio/documents --ignore-existing
mc mb myminio/backups --ignore-existing

# Set bucket policies (public read for product images)
mc policy set public myminio/product-images
mc policy set private myminio/user-avatars
mc policy set public myminio/store-banners
mc policy set private myminio/documents
mc policy set private myminio/backups

echo "E-Ticaret MinIO buckets created successfully!"

# List buckets
mc ls myminio
