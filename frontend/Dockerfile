FROM node:18

# Tạo thư mục làm việc
WORKDIR /usr/src/app

# Copy package.json và package-lock.json trước
COPY package*.json ./

# Cài dependencies
RUN npm install

# Copy toàn bộ code vào container
COPY . .

# Expose port mà React dev server chạy
EXPOSE 3000

# Chạy lệnh start
CMD ["npm", "start"]
