FROM node:12-alpine

RUN mkdir -p /var/src/next
WORKDIR /var/src/next

COPY package*.json /var/src/next/
RUN yarn install
# RUN yarn install --production

COPY . /var/src/next

RUN yarn build build
EXPOSE 3001

CMD "yarn" "dev"
# CMD "npm" "start"