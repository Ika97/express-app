# Stansberry-Research-Investor-Hour

## Getting Started

### Clone the repository

```bash
git clone https://github.com/Stansberry-Holdings/Stansberry-Research-Investor-Hour.git
cd Stansberry-Research-Investor-Hour
```

### Install the modules

```bash
nvm use 8.11.2
npm install --global gulp-cli@latest
npm install
```

### Setup Environment variables

1. Copy the example file as your own environment file. DO NOT COMMIT THIS TO THE REPOSITORY!

    `cp .env.example .env`

    The contents of `.env` will include the following.

    ```sh
    PORT=3000
    TESTING_PORT=3001

    NODE_ENV="development"
    DOMAIN_NAME="localhost"
    SCHEMA="http"

    REDIS_URL="redis://redis:6379"
    REDIS_TTL=60
    MONGO_URL="mongodb://mongo:27017/db"
    ```

### Start the dev server

There are two ways to build & start the dev server.

1. Docker
    1. Create/start: `docker-compose up --build`
    1. Visit [http://localhost:3000](http://localhost:3000)

    More details:
    1. Connect to mongo `mongo localhost:3003`
    1. Visit Redis Commander [http://localhost:3002](http://localhost:3002)

    Other commands:
    1. Stop: `docker-compose stop`
    1. Delete: `docker-compose down`
    1. Start: `docker-compose start` (only after stopping)
    1. Rebuild: `docker-compose up --build` (used when updating files outside of 'src')

1. Gulp
    1. Build: `gulp build`
    1. Start: `npm serve`
    1. Visit [http://localhost:3000](http://localhost:3000)
    1. Stop: `Ctrl + C`

1. NPM
    1. Build: `gulp build`
    1. Start: `npm start`
    1. Watch: `npm run watch`
    1. Debug: `npm run debug`
    1. Visit [http://localhost:3000](http://localhost:3000)
    1. Stop: `Ctrl + C`
