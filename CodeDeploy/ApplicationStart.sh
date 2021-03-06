#!/bin/bash

source ~/.bashrc
export HOME=/root

# Start Process Manager in production mode
cd /srv/app/current

if [ "$APPLICATION_NAME" == "sih-app-prod" ]
then
    pm2 start ecosystem.config.js --env production
fi

if [ "$APPLICATION_NAME" == "sih-app-staging" ]
then
    pm2 start ecosystem.config.js --env staging
fi
