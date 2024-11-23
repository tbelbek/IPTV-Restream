# Frontend Dockerfile
FROM node:20 AS builder

WORKDIR /app

ARG VITE_BACKEND_URL
ARG VITE_BACKEND_STREAMS_PATH
ARG VITE_STREAM_DELAY

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build
COPY . .

ENV VITE_BACKEND_URL=$VITE_BACKEND_URL
ENV VITE_BACKEND_STREAMS_PATH=$VITE_BACKEND_STREAMS_PATH
ENV VITE_STREAM_DELAY=$VITE_STREAM_DELAY

RUN npm run build

# Serve the app using a minimal HTTP server
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]