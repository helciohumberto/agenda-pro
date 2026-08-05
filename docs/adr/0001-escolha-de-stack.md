# ADR-0001: Escolha de stack

## Contexto
Preciso construir um MVP de SaaS multi-tenant em 30 dias, sozinho,
priorizando velocidade sem abrir mão de qualidade testável.

## Decisão
Backend: Node.js + TypeScript + Fastify + Prisma + PostgreSQL
Frontend: React (Vite) + Tailwind

## Justificativa
- Já estudei e já construí outros projetos (racao-gado, cripto-tracker)
  usando essa stack — não gasto tempo de aprendizado em ferramenta nova
- TypeScript reduz erro de tipo em regra de negócio crítica
  (ex: conflito de horário)
- Prisma acelera modelagem sem abrir mão de SQL relacional real

## Consequências
- Positivo: velocidade e tempo — consigo focar no processo e na
  qualidade do código em vez de aprender ferramenta nova no meio do
  prazo
- Negativo/trade-off: não estou aprendendo nada tecnicamente novo neste
  ciclo — o ganho aqui é 100% em disciplina de processo, não em stack