FROM node:18-slim

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./

RUN npm install

# Bundle app source
COPY . .

# Make sure goose is installed
RUN apt-get update && apt-get install -y wget \
    && wget -q -O /usr/local/bin/goose https://github.com/goose-ai/goose/releases/latest/download/goose_linux_x86_64 \
    && chmod +x /usr/local/bin/goose

# Create temp directory
RUN mkdir -p /tmp/deep-research

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "backend/server.js"]
