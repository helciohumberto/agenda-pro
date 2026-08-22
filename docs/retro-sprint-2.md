# Retrospectiva — Sprint 2 (Dias 15-20)

## O que funcionou bem
- Teste E2E com Playwright foi o destaque da sprint — ver o navegador
  abrindo e executando o fluxo sozinho tornou o valor de testes
  automatizados mais concreto do que os testes de unidade/integração
  anteriores
- Bem menos travamento de ambiente que a Sprint 1 — problemas
  pontuais (CORS, UUID inválido no formulário, sintaxe do
  selectOption) resolvidos rapidamente

## O que mais travou
- Entender por que o fluxo do cliente precisa de rotas públicas
  separadas das autenticadas (conceito de arquitetura, não sintaxe)
- Avaliar a vulnerabilidade do Prisma no npm audit — primeira decisão
  da sprint que exigiu julgamento de risco em vez de comando pronto

## Sprint 3 (Dias 22-27)
Produto funcional de ponta a ponta. Foco muda para qualidade
não-funcional: logging, observabilidade, performance e deploy real
em produção.