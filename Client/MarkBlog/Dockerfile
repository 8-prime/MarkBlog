FROM node:16 AS node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=node /app/dist/mark-blog /usr/share/nginx/html