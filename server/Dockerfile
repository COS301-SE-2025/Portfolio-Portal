FROM node:20

# Install system dependencies
RUN apt-get update && apt-get install -y \
    graphicsmagick \
    ghostscript \
    poppler-utils \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads

EXPOSE 8080
ENV PORT=8080

CMD ["node", "server.js"]