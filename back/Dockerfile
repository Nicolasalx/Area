FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
COPY prismaDb ./prismaDb

RUN npm install
RUN npx prisma generate --schema prismaDb

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start"]