# DuoRank

O DuoRank ajuda grupos a acompanhar as ofensivas diárias de estudo no Duolingo. O painel mostra o ranking por dias de ofensiva, quem estudou hoje e quem precisa manter a sequência.

## 🚀 **Funcionalidades Principais**
- ✔️ Ranking dos participantes por dias de ofensiva
- ✔️ Indicador de atividade diária com filtros e busca
- ✔️ Cadastro de participantes pelo nome de usuário do Duolingo
- ✔️ Atualização das informações do grupo pela API

## 🛠️ **Tecnologias**
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **Frontend**: React + TypeScript + Vite

## ▶️ **Executar localmente**

O desenvolvimento usa a API local em `http://localhost:12110`. O Vite encaminha `/api` ao backend, então o valor remoto de `VITE_API_BACKEND` não é usado durante `npm run dev`.

1. Inicie o PostgreSQL isolado para desenvolvimento e configure o backend:

```bash
npm run db:dev

cp back/.env.example back/.env
npm --prefix back install
npm --prefix frontend install
cd back
npx prisma generate
npx prisma migrate deploy
```

O banco local fica disponível apenas em `localhost:5433`; os dados persistem no volume `duorank_dev_data`. O `back/.env.example` já aponta para ele. `DUO_ENDPOINT_URL` é necessário para cadastrar ou atualizar participantes. Não compartilhe nem faça commit do arquivo `.env`.

2. Em um terminal, inicie o backend a partir da raiz do repositório:

```bash
npm run dev:backend
```

3. Em outro terminal, inicie o frontend:

```bash
npm run dev
```

O backend permite por padrão as origens `http://localhost:5173` e `http://127.0.0.1:5173`. Ajuste `CORS_ORIGINS` em `back/.env` se usar outros endereços. Para apontar o proxy do Vite a outro backend local, defina `VITE_DEV_API_TARGET`.

Quando terminar, pare o banco de desenvolvimento com `npm run db:dev:stop`.

Em produção, defina `VITE_API_BACKEND` com o endereço base da API de poliglotas. O painel carrega o ranking em `GET /api/poliglotas/ranking`. A resposta inclui o ranking ordenado, o resumo do grupo e o estado diário de cada participante (`hoje`, `ontem`, `atrasada`, `sem-registro` ou `futura`). O cálculo compara a data da última atividade com a data atual no fuso configurado em `APP_TIME_ZONE` (padrão: `America/Sao_Paulo`).
