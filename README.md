# DuoRank

O DuoRank foi criado para ajudar a acompanhar jogadores do Duolingo, para que seja possível monitorar e manter o streak diário de estudos. A ideia surgiu a partir da dificuldade de acompanhar manualmente os membros do grupo e garantir que todos mantivessem seus hábitos diários.

## 🚀 **Funcionalidades Principais**
- ✔️ Acompanhamento de ofensiva diária (streaks)
- ✔️ Ranking de todos os membros do grupo (planejado)
- ✔️ Perfis dos Poliglotas com detalhes simples (planejado)

## 🛠️ **Tecnologias**
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Frontend**: React, Vite (planejado)

## 📦 **Estrutura do Projeto**
├── api
│   ├── prisma
│   │   ├── migrations
│   │   └── schema.prisma
│   ├── src
│   │   ├── controllers
│   │   │   └── PoliglotasController.ts
│   │   ├── middlewares
│   │   │   └── errorHandler.ts
│   │   ├── routes
│   │   │   └── PoliglotasRoutes.ts
│   │   ├── services
│   │   │   └── PoliglotasService.ts
│   │   ├── types
│   │   │   ├── poliglotaparametros.ts
│   │   │   └── poliglota.ts
│   │   └── server.ts
│   ├── Dockerfile
│   ├── package.json
│   ├── package-lock.json
│   └── tsconfig.json
├── frontend