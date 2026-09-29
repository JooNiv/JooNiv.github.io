FROM node:24-slim

WORKDIR /app

# Copy dependency files first for better caching
COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# Astro dev server
EXPOSE 4321

# Build once so the Pagefind search index exists, then serve with live reload
CMD ["sh", "-c", "npm run build && npm run dev -- --host 0.0.0.0"]
