# Deployment Document

## Step 1: Clone the repository

```bash
git clone https://github.com/seanwhitee/ideasync-app.git
```

## Step 2: Make sure docker and docker compose available on your machine

## Step 3: Env files

Make sure you complete the env files located in backend, frontend, system-init folder.

## Step 4: Start the service by docker compose

### db service

If you want to copy the following commands directly, please make sure you are in the root project directory.

```bash
docker compose --env-file ./backend/.env up db
```

### api service

```bash
docker compose --env-file ./backend/.env up api
```

### init-system service

```bash
docker compose --env-file ./system-init/.env up system-init
```

### ui service

```bash
docker compose --env-file ./frontend/.env up ui
```
