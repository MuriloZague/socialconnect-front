# PR — Aula 09: Front-end React/TS e consumo da API

**Branch:** `aula09` → `main`
**Data:** 05/11/2026

## O que foi feito

- Projeto React + TypeScript criado com Vite (template `react-ts`).
- `src/services/api.ts`: cliente Axios, com a URL base em `VITE_API_URL`.
- `src/types/beneficiario.ts`: tipos dos DTOs.
- `BeneficiarioList`: listagem consumindo `GET /api/v1/beneficiarios`, com estados de carregando, erro e lista vazia.
- `BeneficiarioForm` (desafio da aula): `POST /api/v1/beneficiarios`, campos obrigatórios, mensagem de erro e redirecionamento para a listagem com mensagem de sucesso.

## Como testar

1. Subir a API com o `CorsConfig` (branch `feat/aula09-cors` da API): `mvn spring-boot:run`.
2. `npm install` e `npm run dev`, e abrir http://localhost:5173.
3. Cadastrar com CPF `52998224725` → volta para a listagem com mensagem de sucesso e a linha nova.
4. Repetir o cadastro → mensagem de CPF já cadastrado, sem sair da tela.

## Checklist de Qualidade

- [x] Código compila sem erros (`npm run build`)
- [x] Lint sem erros (`npm run lint`)
- [x] Commits atômicos e descritivos (Conventional Commits)
- [x] `AI_USAGE.md` atualizado

## Uso de IA

- [ ] Não usei IA nesta entrega
- [x] Usei IA — detalhes registrados no `AI_USAGE.md`

## Observações

Diferenças em relação ao código da aula, necessárias para funcionar neste projeto:

- O tipo `Page<T>` da aula é plano, mas `WebConfig` usa `VIA_DTO`, e a API devolve `{ content, page: { size, number, totalElements, totalPages } }`.
- `import type` no lugar de `import { Beneficiario, Page }`, porque o template do Vite liga `verbatimModuleSyntax`.
- Adicionado `react-router-dom`, para o redirecionamento pedido no desafio.
