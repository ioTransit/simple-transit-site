# base node image
FROM node:18-bullseye-slim as base

# set for base and all layer that inherit from it
ENV NODE_ENV production

# pass down env variables
ARG SESSION_SECRET
ARG AGENCY_NAME
ARG MAPBOX_ACCESS_TOKEN
ARG GTFS_URL
ARG ADMIN_EMAIL
ARG ADMIN_PASSWORD
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ARG S3_BUCKET

ENV SESSION_SECRET=${SESSION_SECRET}
ENV AGENCY_NAME=${AGENCY_NAME}
ENV MAPBOX_ACCESS_TOKEN=${MAPBOX_ACCESS_TOKEN}
ENV GTFS_URL=${GTFS_URL}
ENV ADMIN_EMAIL=${ADMIN_EMAIL}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}
ENV REPLICA_URL=s3://${S3_BUCKET}/data.db

ADD https://github.com/benbjohnson/litestream/releases/download/v0.3.8/litestream-v0.3.8-linux-amd64-static.tar.gz /tmp/litestream.tar.gz
RUN tar -C /usr/local/bin -xzf /tmp/litestream.tar.gz

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl sqlite3
 
# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /remix

ADD package.json .npmrc ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /remix

COPY --from=deps /remix/node_modules /remix/node_modules
ADD package.json .npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /remix

COPY --from=deps /remix/node_modules /remix/node_modules

ADD . .
RUN npm run build

ADD drizzle .
RUN npm run generate
RUN npm run db:push

ENV DATABASE_URL=file:/drizzle/sqlite.db
ENV PORT="8080"
ENV NODE_ENV="production"

# Copy Litestream configuration file & startup script.
COPY etc/litestream.yml /etc/litestream.yml
COPY scripts/run.sh /scripts/run.sh

CMD [ "/scripts/run.sh" ]

RUN npm run gtfs
RUN npm run predeploy 

# Finally, build the production image with minimal footprint
FROM base

# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /remix

COPY --from=production-deps /remix/node_modules /remix/node_modules

COPY --from=build /remix/build /remix/build
COPY --from=build /remix/public /remix/public
COPY --from=build /remix/package.json /remix/package.json
COPY --from=build /remix/start.sh /remix/start.sh
COPY --from=build /remix/html /remix/html
COPY --from=build /remix/geojson /remix/geojson
COPY --from=build /remix/drizzle /remix/drizzle

ENTRYPOINT [ "./start.sh" ]
