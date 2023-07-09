FROM node:18-alpine
RUN --mount=type=secret,id=gh_registry_packages \
  cat /run/secrets/gh_registry_packages
WORKDIR /app/backend
EXPOSE 3001
COPY package*.json .
RUN npm install
COPY . .
ENTRYPOINT npm start
