# PR — Aula 10: UI, Formulários e Acessibilidade

**Branch:** `aula10` → `main` (abrir depois do merge de `aula09`)
**Data:** 05/11/2026

## O que foi feito

- **Material UI:** tema em `src/theme.ts`, `ThemeProvider` + `CssBaseline` e `Layout`.
- **Formulário:** React Hook Form + Zod (`src/schemas/beneficiarioSchema.ts`), com tipos inferidos do schema.
  - O CPF é validado pelos dígitos verificadores, com o mesmo algoritmo de `CpfValidator.java`.
  - Erros da API aparecem no campo: `errors[]` do Problem Details e 409 de CPF duplicado.
- **Listagem:** ordenação por coluna, `Skeleton`, `Pagination`, estado vazio com ícone, busca por nome com debounce e erro com "Tentar novamente".
- **Edição e exclusão:** rota `/beneficiarios/:id/editar` (`GET` + `PUT`) e `Dialog` de confirmação.
- **Acessibilidade:** link de pular conteúdo, foco no título ao trocar de rota, foco visível, `aria-label` com o nome da pessoa e tabela com `caption` e `aria-sort`.
- **Testes:** Vitest para o schema e os formatadores.

## Como testar

1. Subir a API com o `CorsConfig` (branch `feat/aula09-cors` da API).
2. `npm install`, `npm test` e `npm run dev`, e abrir http://localhost:5173.
3. Enviar o formulário vazio → erros nos campos, com foco no primeiro.
4. Cadastrar com CPF `52998224724` → "CPF inválido", sem chamar a API. Trocar para `529.982.247-25` → sucesso.
5. Repetir o CPF → erro no campo CPF (409).
6. Cadastrar mais de 10 → paginação; clicar nos cabeçalhos → ordenação.
7. Excluir o único item da última página → volta para a anterior.
8. Parar a API e recarregar → erro com "Tentar novamente".

## Checklist de Qualidade

- [x] Código compila sem erros (`npm run build`)
- [x] Testes passam (`npm test`)
- [x] Lint sem erros (`npm run lint`; há 1 aviso, ver Observações)
- [x] Commits atômicos e descritivos (Conventional Commits)
- [x] `AI_USAGE.md` atualizado
- [ ] Teste de usabilidade cruzado feito (`atividade-aula-10.md`)

## Uso de IA

- [ ] Não usei IA nesta entrega
- [x] Usei IA — detalhes registrados no `AI_USAGE.md`

## Observações

Diferenças em relação ao código da aula:

- **Campos opcionais:** o `.optional()` da aula não cobre o campo em branco, que chega como `""` e daria "Telefone inválido". O schema transforma `""` em `undefined`.
- **`situacaoVulnerabilidade` no formulário:** o `PUT` transforma campos ausentes em nulos, então editar sem esse campo apagaria o dado.
- **`useController` no lugar de `{...register}`:** com o campo controlado, o rótulo do `TextField` não fica sobre o valor na edição.
- **Sem `alert()`:** substituído por `Snackbar` e `Dialog`.
- **Sem `secondary: #ff4081`:** com texto branco essa cor fica abaixo do contraste exigido.

Aviso do lint: `set-state-in-effect` em `BeneficiarioList.tsx`, no `setCarregando(true)` que abre cada consulta. Foi mantido por ser o padrão `useEffect` ensinado na aula.
