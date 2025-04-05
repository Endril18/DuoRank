# DuoRank

O **DuoRank** é um sistema criado para ajudar um grupo de usuários do Duolingo a monitorar e manter o streak diário de estudos. A ideia surgiu a partir da dificuldade de acompanhar manualmente os membros do grupo e garantir que todos mantivessem seus hábitos diários.

### Funcionalidades principais:
- **Ranking**: Visualize um ranking de todos os membros do grupo com base nas suas atividades no Duolingo. (Implementar)
- **Perfil do Usuário**: Detalhes simples sobre a última atividade de cada usuário. (Implementar)
- **Monitoramento de Atividade**: Verifica se o usuário completou a lição do dia no Duolingo. (Implementar)
  
## ⚙️ Tecnologias Usadas

- **Frontend**: React, Vite (configuração rápida e otimizada)
- **Backend**: Node.js (Express), Prisma ORM
- **Banco de Dados**: PostgreSQL
  
## 🗂️ Estrutura do Projeto
DuoRank/ │ ├── backend/ 
│ 
├── prisma/ # Configurações do Prisma 
│ ├── src/ 
│ │ ├── controllers/ # Controladores do backend 
│ │ ├── routes/ # Rotas do backend 
│ │ ├── services/ # Lógica de negócios 
│ │ ├── types/ # Tipos do TypeScript 
│ │ └── server.ts # Arquivo de inicialização do servidor 
│ └── .env # Variáveis de ambiente para o backend 
│ ├── frontend/ # Projeto React 
│ ├── public/ 
│ └── src/ 
│ ├── components/ # Componentes do frontend 
│ ├── views/ # Páginas do frontend 
│ └── App.tsx # Arquivo principal do frontend 
│ ├── .gitignore 
├── LICENSE 
├── README.md # Este arquivo 
├── package.json # Dependências do projeto 
└── tsconfig.json # Configurações do TypeScript

## 🤝 Contribuindo
- Faça um fork do repositório.

- Crie uma branch para a sua feature (git checkout -b feature-nome-da-feature).

- Faça o commit das suas mudanças (git commit -am 'Adiciona nova feature').

- Envie a branch para o repositório remoto (git push origin feature-nome-da-feature).

- Abra um pull request.
