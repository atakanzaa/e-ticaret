# E-Ticaret Zookeeper Custom Image
FROM confluentinc/cp-zookeeper:7.5.0

# Set custom environment variables
ENV ZOOKEEPER_CLIENT_PORT=2181
ENV ZOOKEEPER_TICK_TIME=2000
ENV ZOOKEEPER_INIT_LIMIT=10
ENV ZOOKEEPER_SYNC_LIMIT=5
ENV ZOOKEEPER_MAX_CLIENT_CNXNS=60

# Add health check
HEALTHCHECK --interval=10s --timeout=10s --retries=3 \
    CMD echo stat | nc localhost 2181 || exit 1

# Expose port
EXPOSE 2181

# Create custom configuration
USER root
RUN echo "# E-Ticaret Zookeeper Custom Config" > /etc/kafka/zookeeper.properties && \
    echo "dataDir=/var/lib/zookeeper/data" >> /etc/kafka/zookeeper.properties && \
    echo "dataLogDir=/var/lib/zookeeper/log" >> /etc/kafka/zookeeper.properties && \
    echo "clientPort=2181" >> /etc/kafka/zookeeper.properties && \
    echo "tickTime=2000" >> /etc/kafka/zookeeper.properties && \
    echo "maxClientCnxns=60" >> /etc/kafka/zookeeper.properties

# Switch back to appuser
USER appuser
