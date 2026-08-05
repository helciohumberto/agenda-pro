# Modelo de domínio

## Entidades
- **Tenant**: id, business_name — isola cada negócio dos outros
- **Business**: id, tenant_id, nome, endereço, telefone
- **Staff**: id, tenant_id, nome, email, papel/cargo
- **Service**: id, tenant_id, nome, preço, duração (minutos)
- **Client**: id, tenant_id, nome, contato
- **Appointment**: id, tenant_id, client_id, staff_id, service_id,
  scheduled_at, status (confirmed/cancelled)

## Relacionamentos
- Tenant 1—N Business, Staff, Service, Client
- Appointment aponta pra um Client, um Staff e um Service ao mesmo tempo
- Regra de conflito: não pode haver dois Appointments com o mesmo
  staff_id e scheduled_at sobrepondo, com status ativo