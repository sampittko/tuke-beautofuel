FROM node:14-alpine

RUN mkdir -p /next
WORKDIR /next

COPY package.json /next/
COPY yarn.lock /next/
RUN yarn install
# RUN yarn install --production

COPY . /next

RUN yarn run build
EXPOSE 3001

CMD "yarn" "run" "dev"
# CMD "npm" "start"