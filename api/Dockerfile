FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["node", "server.js"]
