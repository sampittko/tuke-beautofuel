FROM node:12

ENV PORT 3000

# Create app directory
RUN mkdir -p /var/src/next
WORKDIR /var/src/next

# Installing dependencies
COPY package*.json /var/src/next/
RUN npm install --production

# Copying source files
COPY . /var/src/next

# Building app
RUN npm run build
EXPOSE ${PORT}

# Running the app
CMD "npm" "run" "dev"