FROM node:18-alpine
WORKDIR /app/backend
EXPOSE 3001
COPY package*.json .
RUN npm install
COPY . .
ENTRYPOINT npm start
