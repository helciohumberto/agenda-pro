# Contrato de API

## Endpoints principais
| Endpoint | Story |
|---|---|
| POST /auth/register | dona cria negócio |
| POST /auth/login | login |
| POST /staff/invite | convite de funcionário |
| POST /services | cadastro de serviço |
| GET /services/:id/available-slots | ver horários livres |
| POST /appointments | cliente marca horário |
| DELETE /appointments/:id | cancelamento (cliente ou dona) |
| GET /appointments | dona vê tudo do tenant; funcionário vê só o seu |

## POST /appointments

### Request
{ "client_name": "Maria Silva", "client_contact": "maria@email.com",
  "service_id": "uuid", "staff_id": "uuid",
  "scheduled_at": "2026-08-10T14:00:00" }

### Response 201 (sucesso)
{ "id": "uuid", "status": "confirmed",
  "scheduled_at": "2026-08-10T14:00:00",
  "service": { "name": "Corte de cabelo", "duration_minutes": 30 },
  "staff": { "name": "João" } }

### Response 409 (conflito de horário)
{ "error": "SLOT_UNAVAILABLE",
  "message": "Esse horário acabou de ser reservado por outro cliente" }