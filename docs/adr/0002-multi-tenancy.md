# ADR-0002: Estratégia de multi-tenancy

## Contexto
O AgendaPro precisa isolar dados de negócios diferentes (tenants) no
mesmo banco, sem deixar um negócio ver dado de outro.

## Decisão
Schema único no PostgreSQL. Toda tabela (Business, Staff, Service,
Client, Appointment) carrega uma coluna `tenant_id`. Toda query passa
por um middleware que injeta automaticamente o `tenant_id` do usuário
autenticado — nenhuma query manual deve confiar em lembrar de filtrar.

## Alternativa considerada
Schema separado (ou banco separado) por tenant — isolamento mais forte,
mas complexo de operar com poucos tenants pequenos e sem exigência de
compliance que justifique o custo.

## Consequências
- Positivo: simples de operar, migração roda uma vez só, escala bem
  pra dezenas/centenas de negócios pequenos
- Negativo/trade-off: se um cliente grande exigir isolamento físico
  total dos dados dele por contrato, migrar de "schema único" pra
  "schema separado" depois é um trabalho não-trivial — não é uma
  troca de configuração, é uma migração de dado real
- Risco operacional: uma única query sem filtro de tenant_id vaza
  dado entre negócios — por isso o middleware é obrigatório, não
  opcional