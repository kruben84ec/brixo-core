FROM node:22-alpine

WORKDIR /app

# Instalar deps primero para aprovechar cache de capas
COPY frontend/package*.json ./
RUN npm install

# En dev el código llega por volume mount (../frontend:/app)
# Este COPY aplica solo en builds sin volumen (producción)
COPY frontend/ .

EXPOSE 3000
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "3000"]
