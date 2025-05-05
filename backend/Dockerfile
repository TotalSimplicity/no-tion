# =========================
# Base build stage
# =========================
FROM node:alpine AS base

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

# =========================
# Development stage
# =========================
FROM base AS dev

ENV NODE_ENV=dev
RUN npm install --global nodemon

EXPOSE 3001

CMD ["npm", "run", "dev"]


# =========================
# Production stage
# =========================
FROM base AS prod

ENV NODE_ENV=prod

# You could run a build script here if needed (like for frontend)
# RUN npm run build

EXPOSE 3001

CMD ["node", "app.js"]
