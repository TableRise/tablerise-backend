FROM node:18-alpine
WORKDIR /app/backend
EXPOSE 3001
COPY package*.json .
RUN export NODE_AUTH_TOKEN='${{ secrets.GH_REGISTRY_PACKAGES }}'
RUN npm install
COPY . .
ENTRYPOINT npm start
