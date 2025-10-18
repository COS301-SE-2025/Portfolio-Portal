FROM node:20-slim

# Install system dependencies for OCR
RUN apt-get update && apt-get install -y \
    poppler-utils \
    graphicsmagick \
    tesseract-ocr \
    tesseract-ocr-eng \
    ghostscript \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install Node.js dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose port 5050
EXPOSE 5050

# Start the server using npm start (which runs node server.js)
CMD ["npm", "start"]
