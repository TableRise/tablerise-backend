FROM node:20-alpine
WORKDIR /app/backend
EXPOSE 3001
COPY package*.json .
COPY .npmrc .
RUN npm install
COPY . .
ENTRYPOINT npm start
