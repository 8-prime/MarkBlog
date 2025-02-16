# Use a multi-stage build to separate the build environment from the production environment
FROM node:alpine AS builder

WORKDIR /app
COPY package.json .
RUN npm install
# Install types/node as a dev dependency
RUN npm i --save-dev @types/node
COPY . .

RUN npm run build
# Stage 2: Use nginx to serve the static files
FROM nginx:alpine

# Copy the built files from the builder stage to the nginx html directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Embed the nginx configuration directly in the Dockerfile
RUN echo " \
    server { \
    listen 80; \
    root /usr/share/nginx/html; \
    index index.html index.htm; \
    location / { \
    try_files \$uri \$uri/ /index.html; \
    } \
    } \
    " > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]