FROM node:22-slim

WORKDIR /app

# Install deps first for better layer caching.
COPY package*.json ./
RUN npm install

# Copy the rest of the source (overridden by the bind mount in dev).
COPY . .

EXPOSE 3000

# Dev: watch mode. Overridden by docker-compose command as well.
CMD ["npm", "run", "dev"]
