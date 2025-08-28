# E-Ticaret MinIO Custom Image
FROM minio/minio:latest

# Set custom environment variables
ENV MINIO_ROOT_USER=minioadmin
ENV MINIO_ROOT_PASSWORD=minioadmin123
ENV MINIO_CONSOLE_ADDRESS=":9001"

# Add health check
HEALTHCHECK --interval=30s --timeout=20s --retries=3 \
    CMD curl -f http://localhost:9000/minio/health/live || exit 1

# Expose ports
EXPOSE 9000 9001

# Copy initialization script
COPY minio-init.sh /usr/bin/minio-init.sh
RUN chmod +x /usr/bin/minio-init.sh

# Copy bucket policies
COPY bucket-policies/ /etc/minio/policies/

# Custom entrypoint
COPY docker-entrypoint.sh /usr/bin/docker-entrypoint.sh
RUN chmod +x /usr/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/bin/docker-entrypoint.sh"]
CMD ["server", "/data", "--console-address", ":9001"]
