#!/bin/sh -ex

# This file is how Fly starts the server (configured in fly.toml). Before starting
# the server though, we need to run any prisma migrations that haven't yet been
# run, which is why this file exists in the first place.
# Learn more: https://community.fly.io/t/sqlite-not-getting-setup-properly/4386

# allocate swap space
# fallocate -l 512M /swapfile
# chmod 0600 /swapfile
# mkswap /swapfile
# echo 10 >/proc/sys/vm/swappiness
# swapon /swapfile
# echo 1 >/proc/sys/vm/overcommit_memory

# npx prisma migrate deploy
## Enables WAL Mode
npm run enable-wal

# npx concurrently "litestream replicate -config /etc/litestream.yml" "npm run start"
exec litestream replicate -exec "npm run start" /drizzle/data.db s3://simple-transit-site/data.db
