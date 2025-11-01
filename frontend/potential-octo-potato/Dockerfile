FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app
COPY --from=build /app/dist ./dist

RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "4173"]
