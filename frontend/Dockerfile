FROM arm64v8/node:22-alpine

WORKDIR /app

COPY frontend/. ./

RUN rm -rf node_modules

RUN rm package-lock.json

# Install dependencies
RUN npm install

# Build the project
RUN npm run build

# Start the application
CMD [ "npm", "start" ]
