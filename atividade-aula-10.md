# Atividade — Aula 10: Design Studio e Teste de Usabilidade

**Disciplina:** ITE005 — Tópicos Especiais em Sistemas para Internet III

## 1. Design Studio: requisitos

| Requisito | Onde |
|-----------|------|
| Ordenação por coluna (clicar no cabeçalho) | `BeneficiarioList.tsx`, `TableSortLabel` (com `aria-sort`) |
| Editar e Excluir com ícone e `aria-label` | `BeneficiarioList.tsx`, `IconButton` com o nome da pessoa no rótulo |
| "Nenhum beneficiário encontrado" com ícone | `BeneficiarioList.tsx` |
| Carregamento com `Skeleton` | `BeneficiarioList.tsx` e `BeneficiarioEditar.tsx` |
| Paginação com MUI `Pagination` | `BeneficiarioList.tsx` |
| Responsividade (mobile-first) | Colunas de `COLUNAS` em `BeneficiarioList.tsx` |

## 2. Verificações automatizadas

Executadas pelo Claude em 05/11/2026, com a API e o front rodando, no Chrome via Playwright e com dados fictícios. **Não substituem o teste entre duplas da seção 3.**

| Critério | Como foi verificado | Resultado |
|----------|---------------------|-----------|
| Clareza de erros | Campo vazio, CPF inválido e CPF duplicado mostram mensagem no campo | Passou |
| Teclado | Cadastro completo só com Tab e Enter; link de pular conteúdo; Esc fecha o diálogo | Passou |
| Contraste e ARIA | axe (WCAG 2.1 A/AA) em 8 estados da interface | Sem violações |
| Lighthouse | Categoria Acessibilidade na listagem e no formulário | 100 nas duas |
| Responsividade | Largura de 360 px, sem rolagem horizontal | Passou |

Limite conhecido: não foi feito teste com leitor de tela real (NVDA, por exemplo). O axe e o Lighthouse só detectam parte dos problemas de acessibilidade.

## 3. Teste de usabilidade cruzado

> A preencher pela dupla avaliadora, sem olhar o código.

**Dupla avaliadora:** ______________________ **Data:** ____/____/______

| Critério | Como testar | Resultado | Observações |
|----------|-------------|-----------|-------------|
| Eficiência | Cadastrar um beneficiário em menos de 30 s | | |
| Clareza de erros | Mensagens de erro são claras e úteis | | |
| Acessibilidade por teclado | Interface funciona sem mouse (só Tab e Enter) | | |
| Contraste | Contraste de cores é adequado (WebAIM) | | |
| Responsividade | Layout funciona em mobile (redimensionar a janela) | | |

## 4. Mudanças feitas a partir do feedback

> A preencher depois do teste cruzado.

-
