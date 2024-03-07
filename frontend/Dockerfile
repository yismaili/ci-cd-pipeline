FROM node:14-alpine

WORKDIR /app
# ENV NODE_ENV development

COPY package.json package-lock.json ./

RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD [ "npm", "start" ]
