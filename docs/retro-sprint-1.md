# Retrospectiva — Sprint 1 (Dias 8-14)

## O que funcionou bem
- Lógica de negócio (regras de conflito de horário, separação
  repository/rota) não travou — testes de TDD passaram limpo na
  maioria das primeiras tentativas
- Regra de conflito de horário garantida em duas camadas: constraint
  no banco + captura do erro na aplicação, testada automaticamente

## O que mais travou
- Multi-tenancy foi o conceito mais denso da sprint — exigiu reforço
  extra no questionário do Dia 6 antes de fixar
- Ambiente consumiu mais tempo que lógica: Postgres desligando
  sozinho entre sessões, conflito de porta 5432 com container Docker
  antigo (racao-gado), breaking changes do Prisma 7 (datasource,
  driver adapter, dotenv não carregado automaticamente)
- Padrão repetido: testes falhando por dado duplicado (email fixo
  colidindo entre execuções) — aconteceu 3 vezes antes de virar
  hábito usar `randomUUID()` desde a primeira escrita do teste

## O que fazer diferente na Sprint 2
- Todo teste que cria dado com campo `@unique` já nasce usando
  `randomUUID()`, não como correção depois
- Habilitar `sudo systemctl enable postgresql@18-main` pra não
  precisar religar o banco toda sessão