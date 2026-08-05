# Backlog e Sprint 1

## Critério de aceite — exemplo (Story 9)
Como dona, quero que o sistema recuse marcar dois agendamentos no
mesmo horário com o mesmo profissional, para não perder cliente por
engano de agenda duplicada.

- Dado um horário livre para o profissional, quando um cliente tenta
  marcar, então o sistema cria o agendamento (201)
- Dado um horário já ocupado para o profissional, quando outro
  cliente tenta marcar o mesmo horário, então o sistema recusa com
  conflito (409)
- Dado um horário ocupado para um profissional, quando um cliente
  tenta marcar o mesmo horário com outro profissional, então o
  sistema cria normalmente (201) — a constraint é por
  (staff_id, scheduled_at), não só pelo horário

## Sprint 1 (dias 8-14)
1. Schema + migrations
2. Story 1 — cadastro da dona + criação do tenant
3. Story 2 — convite de funcionário
4. Cadastro de serviço
5. Story 9 — regra de conflito de horário

## Sprint 2 (dias 15-21) — fora do escopo desta sprint
Stories 3, 4, 5, 6, 7, 8 (marcar, cancelar, lembrete, ver horários)