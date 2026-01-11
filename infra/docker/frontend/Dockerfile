FROM node:20-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo los archivos de dependencias primero
COPY frontend/package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del frontend
COPY frontend/ .

# Build del frontend
RUN npm run build

# Exponemos el puerto estándar de React
EXPOSE 3000

# Servir la app
CMD ["npm", "start"]
