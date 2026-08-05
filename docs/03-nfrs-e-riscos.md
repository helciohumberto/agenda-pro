# Requisitos não-funcionais e riscos

## NFRs
- Senha de usuário nunca fica guardada em texto puro (sempre
  criptografada).
- Dados de um negócio nunca aparecem pra outro negócio (isolamento
  total entre tenants).
- Ver os horários livres de um serviço deve ser rápido, mesmo com
  vários agendamentos no dia.
- O sistema aguenta uns 50 negócios cadastrados, cada um com até 10
  funcionários, sem travar ou ficar lento.

## Riscos
| Risco | Impacto | Mitigação |
|---|---|---|
| Sistema deixa marcar dois clientes no mesmo horário por engano | Cliente chega e não tem quem atenda | Testar essa regra primeiro, antes de qualquer outra coisa |
| Prazo de 30 dias não ser suficiente | Projeto fica incompleto | Cortar coisas como "remarcar" ou "SMS" antes de cortar qualidade |
| Perder tempo aprendendo ferramenta nova no meio do projeto | Atraso desnecessário | Usar só o que já domina (Node, React, PostgreSQL) |