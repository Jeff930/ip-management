FROM node:22

WORKDIR /app

COPY package*.json ./

RUN npm install --include=dev

COPY . .

EXPOSE 3000

CMD ["npx", "nodemon", "-L", "--inspect=0.0.0.0", "src/server.js"]
