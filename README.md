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

## ▶️ **Executar o frontend**

Com a API em execução na porta `12110`, instale as dependências e inicie o painel:

```bash
cd frontend
npm install
npm run dev
```

Por padrão, o frontend usa `http://localhost:12110/api/poliglotas`. Para usar outra URL, defina `VITE_API_BACKEND` no ambiente do Vite com o endereço base da API de poliglotas.
