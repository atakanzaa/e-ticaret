# E-Ticaret RabbitMQ Custom Image
FROM rabbitmq:3-management-alpine

# Set custom environment variables
ENV RABBITMQ_DEFAULT_USER=admin
ENV RABBITMQ_DEFAULT_PASS=admin123
ENV RABBITMQ_DEFAULT_VHOST=/

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD rabbitmq-diagnostics -q ping || exit 1

# Expose ports
EXPOSE 5672 15672

# Copy custom configuration and definitions
COPY rabbitmq.conf /etc/rabbitmq/rabbitmq.conf
COPY definitions.json /etc/rabbitmq/definitions.json

# Enable management plugin and configure
RUN rabbitmq-plugins enable --offline rabbitmq_management && \
    rabbitmq-plugins enable --offline rabbitmq_prometheus && \
    rabbitmq-plugins enable --offline rabbitmq_shovel && \
    rabbitmq-plugins enable --offline rabbitmq_shovel_management

# Add custom startup script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD ["rabbitmq-server"]
