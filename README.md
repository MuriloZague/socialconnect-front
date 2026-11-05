# SocialConnect Front

> Front-end em React + TypeScript da [SocialConnect API](https://github.com/MuriloZague/socialconnect-api-aulas).

**Disciplina:** ITE005 — Tópicos Especiais em Sistemas para Internet III
**Stack:** React 19 · TypeScript · Vite · Axios · React Router · Material UI · React Hook Form · Zod · Vitest

## Como rodar

### Pré-requisitos

- Node.js 24 e npm
- A API no ar em `http://localhost:8080`, em uma versão com o `CorsConfig` (branch `feat/aula09-cors` da API)

### Passos

```bash
npm install
npm run dev
```

A aplicação abre em http://localhost:5173. A API só aceita essa origem, então mantenha a porta 5173.

Para usar outro endereço de API, copie `.env.example` para `.env` e altere `VITE_API_URL`.

## Scripts

| Comando | O que faz |
|---------|-----------|
| `npm run dev` | Sobe o servidor de desenvolvimento |
| `npm run build` | Checa os tipos e gera o build de produção |
| `npm run lint` | Roda o linter (oxlint) |
| `npm test` | Roda os testes unitários (Vitest) |

## Funcionalidades

- Listagem paginada de beneficiários, com ordenação por coluna e busca por nome
- Cadastro e edição com validação no navegador (incluindo os dígitos do CPF)
- Erros da API exibidos no campo correspondente (ex.: CPF já cadastrado)
- Exclusão com confirmação
- Layout responsivo e navegação completa por teclado

## Estrutura

```
src/
├── components/   # telas e componentes reutilizáveis
├── schemas/      # validação com Zod
├── services/     # chamadas à API (Axios)
├── types/        # interfaces dos DTOs
├── utils/        # formatação de CPF, telefone e data
├── theme.ts      # tema do Material UI
└── App.tsx       # rotas
```

## Uso de IA

O registro de uso de IA generativa está em [`AI_USAGE.md`](AI_USAGE.md).
