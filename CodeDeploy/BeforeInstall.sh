#!/bin/bash

source ~/.bashrc
export HOME=/root

# clean contents from the current application folder
if [ -d /srv/app/current ]; then
    rm --recursive --force /srv/app/current
    mkdir /srv/app/current
    chown --recursive ubuntu /srv/app/current
fi
