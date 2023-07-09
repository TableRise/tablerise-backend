FROM node:18-alpine
ARG NODE_AUTH_TOKEN
ENV NODE_AUTH_TOKEN=${NODE_AUTH_TOKEN}
WORKDIR /app/backend
EXPOSE 3001
COPY package*.json .
RUN npm install
COPY . .
ENTRYPOINT npm start
