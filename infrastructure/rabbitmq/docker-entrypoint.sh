#!/bin/bash

# E-Ticaret RabbitMQ Custom Entry Point

echo "Starting E-Ticaret RabbitMQ..."

# Start RabbitMQ in background
rabbitmq-server &
RABBITMQ_PID=$!

# Wait for RabbitMQ to start
sleep 15

# Create additional configurations
echo "Configuring E-Ticaret specific settings..."

# Wait for RabbitMQ to be fully ready
rabbitmqctl wait --timeout 60

# Delete default guest user for security
rabbitmqctl delete_user guest || true

# Create admin user with proper permissions
rabbitmqctl add_user admin admin123 || true
rabbitmqctl change_password admin admin123
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"

# Create additional users if needed
# rabbitmqctl add_user eticaret_user eticaret_pass
# rabbitmqctl set_permissions -p / eticaret_user ".*" ".*" ".*"

echo "E-Ticaret RabbitMQ configuration completed!"

# Bring RabbitMQ to foreground
wait $RABBITMQ_PID
