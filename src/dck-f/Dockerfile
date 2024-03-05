FROM node:14-alpine

WORKDIR /app
COPY initenv.sh /app/

RUN chmod +x initenv.sh
RUN npm install 
# RUN ./initenv.sh
ENTRYPOINT [ "./initenv.sh" ]
CMD ["npm", "start"]

