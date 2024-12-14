FROM node:lts-slim AS dev

RUN apt-get update -y
RUN apt-get install -y openssl

COPY prisma/ /app/prisma/

WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
EXPOSE 3000
CMD npm run dev