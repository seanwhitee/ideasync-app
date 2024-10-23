FROM arm64v8/node:22-alpine

WORKDIR /app

COPY system-init/. ./

RUN rm -rf node_modules

RUN rm package-lock.json

# Install dependencies
RUN npm install

CMD [ "node", "initScript.js" ]