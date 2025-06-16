FROM node:18

WORKDIR /api

# Copia apenas o necessário para instalar dependências
COPY package.json package-lock.json ./
COPY tsconfig.json ./
COPY prisma ./prisma/

# Instala as dependências
RUN npm install

# Copia o restante do código
COPY . .

# Faz o build (ts) e gera o Prisma Client
RUN npm run build && npx prisma generate

# Script do package.json para iniciar
CMD ["node", "dist/server.js"]