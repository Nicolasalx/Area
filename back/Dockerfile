FROM node:22-alpine

WORKDIR /usr/src/app

RUN apk add --no-cache \
    postgresql-client \
    python3 \
    make

COPY package.json ./

RUN npm install

COPY prisma ./prisma/

RUN npx prisma generate

COPY . .

RUN npm run build

EXPOSE 8080

CMD npx prisma db push && node ./prisma/migrate.js ./prisma/seed && npm run start