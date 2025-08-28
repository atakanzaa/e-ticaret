# E-Ticaret Kafka Custom Image
FROM confluentinc/cp-kafka:7.5.0

# Set custom environment variables
ENV KAFKA_BROKER_ID=1
ENV KAFKA_ZOOKEEPER_CONNECT=zookeeper:2181
ENV KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://localhost:9092,INTERNAL://kafka:9093
ENV KAFKA_LISTENER_SECURITY_PROTOCOL_MAP=PLAINTEXT:PLAINTEXT,INTERNAL:PLAINTEXT
ENV KAFKA_LISTENERS=PLAINTEXT://0.0.0.0:9092,INTERNAL://0.0.0.0:9093
ENV KAFKA_INTER_BROKER_LISTENER_NAME=INTERNAL
ENV KAFKA_OFFSETS_TOPIC_REPLICATION_FACTOR=1
ENV KAFKA_AUTO_CREATE_TOPICS_ENABLE=true
ENV KAFKA_LOG_RETENTION_HOURS=168
ENV KAFKA_LOG_RETENTION_BYTES=1073741824
ENV KAFKA_LOG_SEGMENT_BYTES=1073741824

# Add health check
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD kafka-topics --bootstrap-server localhost:9092 --list || exit 1

# Expose ports
EXPOSE 9092 9093

# Create custom startup script
USER root
COPY kafka-topics-init.sh /usr/bin/kafka-topics-init.sh
RUN chmod +x /usr/bin/kafka-topics-init.sh

# Switch back to appuser
USER appuser
