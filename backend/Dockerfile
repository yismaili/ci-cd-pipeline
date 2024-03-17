FROM node:18-bullseye-slim

RUN apt update -y && apt install -y git

WORKDIR /app

RUN npm install -g npm@latest && npm i -g @nestjs/cli

ENV NODE_ENV development

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start:dev"]
