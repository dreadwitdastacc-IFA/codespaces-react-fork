FROM node:18-alpine

WORKDIR /usr/src/app
COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "openai.js"]
