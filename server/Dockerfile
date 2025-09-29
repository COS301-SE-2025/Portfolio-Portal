FROM node:20

# Install system dependencies
RUN apt-get update && apt-get install -y \
    graphicsmagick \
    ghostscript \
    poppler-utils \
    tesseract-ocr \
    && rm -rf /var/lib/apt/lists/*

# Verify installations (optional but helpful for debugging)
RUN which pdfinfo && which gm && which tesseract

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy app code
COPY . .

EXPOSE 8080

CMD ["node", "server.js"]