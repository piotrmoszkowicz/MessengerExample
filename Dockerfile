FROM node:8
WORKDIR /bot
COPY . /bot

RUN npm install

EXPOSE 3000
CMD [ "npm", "start" ]