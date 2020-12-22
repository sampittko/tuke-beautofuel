FROM node:14-alpine

RUN mkdir -p /var/src/next
WORKDIR /var/src/next

COPY package.json /var/src/next/
COPY yarn.lock /var/src/next/

RUN yarn install
# RUN yarn install --production

COPY . /var/src/next

RUN yarn run build
EXPOSE 3001

CMD "yarn" "run" "dev"
# CMD "yarn" "run" "start"