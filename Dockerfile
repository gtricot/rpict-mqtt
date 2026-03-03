FROM node:22-alpine

LABEL maintainer="gtricot"

# Install system dependencies
# Add TZDATA to allow easy local time configuration
RUN apk update \
    && apk add --no-cache make gcc g++ python3 linux-headers udev tzdata \
    && rm -rf /var/cache/apk/*

# Set working directory
WORKDIR /app

# Copy node app
COPY app/ ./

# Install all dependencies (including devDependencies for TypeScript compilation)
RUN npm ci && npm rebuild --build-from-source

# Build TypeScript to JavaScript
RUN npm run build

# Remove devDependencies to reduce image size
RUN npm prune --omit=dev

# Default log format
ENV LOG_FORMAT=text

# Enable serialport debug option
# ENV DEBUG=serialport*

# Default entrypoint
COPY Docker.entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh
ENTRYPOINT ["/usr/bin/entrypoint.sh"]

# Default Command
CMD ["node", "dist/index.js"]
