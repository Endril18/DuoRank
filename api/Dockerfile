FROM node:latest

WORKDIR /api

COPY . .

RUN rm -rf node_modules
RUN npm install

# 4. Compila o TypeScript (gera os arquivos em /dist)
RUN npm run build

# Gera o Prisma Client
RUN npx prisma generate --schema=src/prisma/schema.prisma

CMD ["npm", "start"]

EXPOSE 12110