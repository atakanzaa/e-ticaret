# E-Ticaret PostgreSQL Custom Image
FROM postgres:16-alpine

# Set custom environment variables
ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=123456
ENV POSTGRES_DB=eticaret

# Copy initialization scripts
COPY init-databases.sql /docker-entrypoint-initdb.d/

# Add health check
HEALTHCHECK --interval=10s --timeout=5s --retries=5 \
    CMD pg_isready -U $POSTGRES_USER -d $POSTGRES_DB || exit 1

# Expose port
EXPOSE 5432

# Add custom configuration
RUN echo "# E-Ticaret PostgreSQL Custom Config" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "max_connections = 200" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "shared_buffers = 256MB" >> /usr/local/share/postgresql/postgresql.conf.sample && \
    echo "effective_cache_size = 1GB" >> /usr/local/share/postgresql/postgresql.conf.sample
