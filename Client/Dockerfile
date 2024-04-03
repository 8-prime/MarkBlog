FROM node:18 AS node

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run deploy

FROM nginx:alpine

COPY --from=node /app/dist/mark-blog /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/nginx.conf