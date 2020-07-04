FROM node:12.16.1
ENV NPM_CONFIG_LOGLEVEL warn
RUN mkdir -p /usr/src/app
EXPOSE 3000
WORKDIR /usr/src/app
ADD . .
ENTRYPOINT ["node", "build/app.js"]
