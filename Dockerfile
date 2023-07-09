FROM node:18-alpine
RUN --mount=type=secret,id=NODE_AUTH_TOKEN \
  NODE_AUTH_TOKEN="$( cat /run/secrets/NODE_AUTH_TOKEN )"
WORKDIR /app/backend
EXPOSE 3001
COPY package*.json .
RUN npm install
COPY . .
ENTRYPOINT npm start
