# Chọn Node.js version
FROM node:18

# Tạo thư mục app trong container
WORKDIR /usr/src/app

# Copy package.json + package-lock.json
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code
COPY . .

# Expose port
EXPOSE 3001

# Chạy server
CMD ["npm", "run", "dev"]
