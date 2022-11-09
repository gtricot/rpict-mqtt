FROM node:18-alpine

LABEL maintainer="gtricot"

# Add TZDATA to allow easy local time configuration
RUN apk update \
    && apk add --no-cache tzdata \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy node app
COPY app/ ./

# Install node dependendencies
RUN npm ci --omit=dev

# Default log format
ENV LOG_FORMAT=text

# Enable serialport debug option
ENV DEBUG=serialport*

# Default entrypoint
COPY Docker.entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

# Default Command
CMD ["node", "index"]
