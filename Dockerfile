FROM node:8.11.2

ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH=$PATH:/home/node/.npm-global/bin

RUN apt-get update && \
    apt-get -y upgrade && \
    npm install --global npm@latest && \
    npm install --global gulp-cli@latest

WORKDIR /home/node/app

COPY . .

RUN npm install && \
    gulp build

EXPOSE 3000 3001
CMD [ "gulp", "serve" ]
