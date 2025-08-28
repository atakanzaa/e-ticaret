# E-Ticaret MailHog Custom Image
FROM mailhog/mailhog:latest

# Add labels for identification
LABEL maintainer="E-Ticaret Team"
LABEL description="Custom MailHog for E-Ticaret Marketplace"

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:8025 || exit 1

# Expose ports
EXPOSE 1025 8025

# Set environment variables for SMTP configuration
ENV MH_SMTP_BIND_ADDR=0.0.0.0:1025
ENV MH_API_BIND_ADDR=0.0.0.0:8025
ENV MH_UI_BIND_ADDR=0.0.0.0:8025
ENV MH_STORAGE=memory

# Copy custom entry point script as root
USER root
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["MailHog"]
