#!/bin/bash

# E-Ticaret MinIO Custom Entry Point

echo "Starting E-Ticaret MinIO..."

# Start MinIO server in background
minio server /data --console-address ":9001" &
MINIO_PID=$!

# Wait for MinIO to be ready
sleep 15

# Run initialization script
/usr/bin/minio-init.sh &

echo "E-Ticaret MinIO configuration completed!"

# Bring MinIO to foreground
wait $MINIO_PID
