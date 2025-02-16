FROM node:alpine

WORKDIR /app

COPY package.json .

RUN npm install
RUN npm i --save-dev @types/node
RUN npm i -g serve

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "serve", "-s", "dist" ]