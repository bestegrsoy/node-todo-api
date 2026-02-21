FROM node:20-alpine

# PM2'yi global kur
RUN npm install -g pm2

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000

CMD ["pm2-runtime", "start", "server.js"]
