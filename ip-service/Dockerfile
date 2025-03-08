FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npx", "nodemon", "-L", "--inspect=0.0.0.0", "src/server.js"]
