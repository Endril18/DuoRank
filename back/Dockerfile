# FROM node:18

# WORKDIR /api

# # Copia apenas o necessário para instalar dependências
# COPY package.json package-lock.json ./
# COPY tsconfig.json ./
# COPY prisma ./prisma/

# # Instala as dependências
# RUN npm install

# # Copia o restante do código
# COPY . .

# # Faz o build (ts) e gera o Prisma Client
# RUN npm run build && npx prisma generate

# # Script do package.json para iniciar
# CMD ["node", "dist/server.js"]

FROM node:18-alpine

WORKDIR /back

# Instala dependências de build (incluindo Prisma)
RUN apk add --no-cache python3 make g++

# Cache de dependências
COPY package.json package-lock.json ./
RUN npm install  # Sem o --production para garantir que as dependências de desenvolvimento sejam instaladas

# Copia o código
COPY . .

# Build e Prisma
RUN npm run build && npx prisma generate

CMD ["node", "dist/server.js"]
