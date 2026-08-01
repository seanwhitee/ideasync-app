FROM arm64v8/node:22-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@11.8.0 --activate

# Install dependencies first so this layer is cached across builds
# that only change application source.
COPY frontend/package.json frontend/pnpm-lock.yaml frontend/pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY frontend/. ./

# Build the project
RUN pnpm run build

# Start the application
CMD [ "pnpm", "start" ]
