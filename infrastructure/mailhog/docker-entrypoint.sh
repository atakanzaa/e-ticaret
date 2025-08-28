#!/bin/sh

# E-Ticaret MailHog Custom Entry Point

echo "Starting E-Ticaret MailHog..."

echo "E-Ticaret MailHog configuration:"
echo "  SMTP Server: 0.0.0.0:1025"
echo "  Web Interface: 0.0.0.0:8025"
echo "  Storage: In-Memory"

echo "E-Ticaret MailHog started successfully!"

# Start MailHog
exec MailHog
