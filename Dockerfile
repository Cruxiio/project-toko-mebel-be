# Gunakan image Node.js sebagai base image
FROM node:18-alpine

# Tentukan working directory di dalam container
WORKDIR /app

# Salin seluruh source code ke dalam working directory di container
COPY . .

# Salin file package.json dan package-lock.json untuk menginstal dependensi
COPY package*.json ./

# Instal dependensi aplikasi
RUN npm install

# Ekspos port yang akan digunakan oleh aplikasi
EXPOSE 6347

# Jalankan perintah build untuk aplikasi NestJS
RUN npm run build

# Perintah default untuk menjalankan aplikasi
CMD ["npm", "run", "start:prod"]
