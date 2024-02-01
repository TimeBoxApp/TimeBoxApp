#
# 🧑‍💻 Development
#
FROM node:21-alpine as dev
# add the missing shared libraries from alpine base image
RUN apk add --no-cache libc6-compat
# Create app folder
WORKDIR /app

# Set to dev environment
ENV NODE_ENV development

# Create non-root user for Docker
RUN addgroup --system --gid 1001 node || true
RUN adduser --system --uid 1001 node || true

# Copy package.json and yarn.lock files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn --frozen-lockfile

# Copy source code into app folder
COPY . .

RUN chown -R node:node /app/node_modules

# Set Docker as a non-root user
USER node

CMD ["yarn", "start"]

#
# 🏡 Production Build
#
FROM node:21-alpine as build
WORKDIR /app
RUN apk add --no-cache libc6-compat

# Set to production environment
ENV NODE_ENV production

# Re-create non-root user for Docker
RUN addgroup --system --gid 1001 node
RUN adduser --system --uid 1001 node

# Copy dependencies from dev stage
COPY --chown=node:node --from=dev /app/node_modules ./node_modules
COPY --chown=node:node --from=dev /app/package.json ./package.json

# Copy source code
COPY --chown=node:node . .

# Generate the production build.
RUN yarn build

#
# 🚀 Production Server
#
# We use Nginx to serve the React static files
FROM nginx:alpine as prod

# Set working directory to nginx asset directory
WORKDIR /usr/share/nginx/html

# Remove default nginx static assets
RUN rm -rf ./*

COPY --from=build /app/build .

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
