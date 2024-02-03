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

ENV SESSION_SECRET=${SESSION_SECRET}
ENV AGENCY_NAME=${AGENCY_NAME}
ENV MAPBOX_ACCESS_TOKEN=${MAPBOX_ACCESS_TOKEN}
ENV GTFS_URL=${GTFS_URL}
ENV ADMIN_EMAIL=${ADMIN_EMAIL}
ENV ADMIN_PASSWORD=${ADMIN_PASSWORD}


# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl sqlite3

# Install all node_modules, including dev dependencies
FROM base as deps

WORKDIR /myapp

ADD package.json .npmrc ./
RUN npm install --include=dev

# Setup production node_modules
FROM base as production-deps

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules
ADD package.json .npmrc ./
RUN npm prune --omit=dev

# Build the app
FROM base as build

WORKDIR /myapp

COPY --from=deps /myapp/node_modules /myapp/node_modules

ADD . .
RUN npm run build

ADD drizzle .
RUN npm run generate

ENV DATABASE_URL=file:/data/sqlite.db
ENV PORT="8080"
ENV NODE_ENV="production"

RUN npm run gtfs

# Finally, build the production image with minimal footprint
FROM base


# add shortcut for connecting to database CLI
RUN echo "#!/bin/sh\nset -x\nsqlite3 \$DATABASE_URL" > /usr/local/bin/database-cli && chmod +x /usr/local/bin/database-cli

WORKDIR /myapp

COPY --from=production-deps /myapp/node_modules /myapp/node_modules

COPY --from=build /myapp/build /myapp/build
COPY --from=build /myapp/public /myapp/public
COPY --from=build /myapp/package.json /myapp/package.json
COPY --from=build /myapp/start.sh /myapp/start.sh
COPY --from=build /myapp/html /myapp/html
COPY --from=build /myapp/geojson /myapp/geojson
COPY --from=build /myapp/drizzle /myapp/drizzle

ENTRYPOINT [ "./start.sh" ]
