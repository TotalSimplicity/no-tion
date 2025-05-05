FROM node:22-alpine AS installer
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

FROM node:22-alpine AS dev
WORKDIR /app
# For dev, we'll mount the local directory so we don't need to copy files
# Only copy node_modules to avoid overwriting them with the volume mount
COPY --from=installer /app/node_modules /app/node_modules
EXPOSE 5173
CMD ["npm", "run", "dev"]

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=installer /app /app
RUN npm run build

FROM node:22-alpine AS prod
WORKDIR /app

# Copy only what's needed for production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/build ./
COPY --from=builder /app/node_modules ./node_modules/

EXPOSE 3000

# For SvelteKit with adapter-node, the entry point is in the build directory
CMD ["node", "build"]