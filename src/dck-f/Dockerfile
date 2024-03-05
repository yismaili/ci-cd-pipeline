FROM node:14-alpine

WORKDIR /app
COPY initenv.sh /app/

RUN chmod +x initenv.sh
# RUN ./initenv.sh
CMD ["npm", "start"]
ENTRYPOINT [ "./initenv.sh" ]

