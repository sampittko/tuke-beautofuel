FROM node:12-alpine

RUN mkdir -p /var/src/next
WORKDIR /var/src/next

COPY package*.json /var/src/next/
RUN npm install
# RUN npm install --production

COPY . /var/src/next

RUN npm run build
EXPOSE 3001

CMD "npm" "run" "dev"
# CMD "npm" "start"