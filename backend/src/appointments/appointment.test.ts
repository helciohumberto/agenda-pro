import { describe, it, expect, beforeAll } from 'vitest';
import { randomUUID } from 'crypto';
import { prisma } from '../prisma';
import { createAppointment } from './appointment-repository';

describe('criação de agendamento', () => {
  let tenantId: string, clientId: string, staffId: string, serviceId: string;

  beforeAll(async () => {
    const suffix = randomUUID();
    const tenant = await prisma.tenant.create({ data: { businessName: 'Salão Appointment TDD' } });
    tenantId = tenant.id;

    const client = await prisma.client.create({
      data: { tenantId, name: 'Cliente Teste', contact: `cliente-${suffix}@teste.com` },
    });
    clientId = client.id;

    const staff = await prisma.staff.create({
      data: { tenantId, name: 'Staff Teste', email: `staff-appt-${suffix}@teste.com`, role: 'Cabeleireiro' },
    });
    staffId = staff.id;

    const service = await prisma.service.create({
      data: { tenantId, name: 'Corte', price: 30, durationMinutes: 30 },
    });
    serviceId = service.id;
  });

  it('cria um agendamento em horário livre', async () => {
    const appointment = await createAppointment(tenantId, {
      clientId, staffId, serviceId,
      scheduledAt: new Date('2026-09-01T14:00:00'),
    });
    expect(appointment.status).toBe('confirmed');
  });

  it('recusa dois agendamentos no mesmo horário com o mesmo staff', async () => {
    await createAppointment(tenantId, {
      clientId, staffId, serviceId,
      scheduledAt: new Date('2026-09-01T15:00:00'),
    });

    await expect(
      createAppointment(tenantId, {
        clientId, staffId, serviceId,
        scheduledAt: new Date('2026-09-01T15:00:00'),
      })
    ).rejects.toThrow('SLOT_UNAVAILABLE');
  });

  it('permite dois agendamentos no mesmo horário com staff diferente', async () => {
    const outroStaff = await prisma.staff.create({
      data: { tenantId, name: 'Outro Staff', email: `outro-staff-${randomUUID()}@teste.com`, role: 'Cabeleireiro' },
    });

    await createAppointment(tenantId, {
      clientId, staffId, serviceId,
      scheduledAt: new Date('2026-09-01T16:00:00'),
    });

    const segundo = await createAppointment(tenantId, {
      clientId, staffId: outroStaff.id, serviceId,
      scheduledAt: new Date('2026-09-01T16:00:00'),
    });

    expect(segundo.status).toBe('confirmed');
  });
});