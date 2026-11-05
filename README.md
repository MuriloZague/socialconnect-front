# SocialConnect Front

> Front-end em React + TypeScript da [SocialConnect API](https://github.com/MuriloZague/socialconnect-api-aulas).

**Disciplina:** ITE005 — Tópicos Especiais em Sistemas para Internet III
**Stack:** React 19 · TypeScript · Vite · Axios · React Router

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

## Estrutura

```
src/
├── components/   # BeneficiarioList, BeneficiarioForm
├── services/     # chamadas à API (Axios)
├── types/        # interfaces dos DTOs
└── App.tsx       # rotas
```

## Uso de IA

O registro de uso de IA generativa está em [`AI_USAGE.md`](AI_USAGE.md).
