import { describe, it, expect } from 'vitest';
import { randomUUID } from 'crypto';
import { buildApp } from './server';

describe('fluxo completo: registro -> servico -> agendamento', () => {
  it('dona registra negocio, cria servico e cliente agenda horario', async () => {
    const app = buildApp();
    await app.ready();

    const email = `dona-e2e-${randomUUID()}@teste.com`;

    // 1. Dona se registra
    const registerRes = await app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        businessName: 'Salão E2E',
        ownerName: 'Dona E2E',
        email,
        password: 'senha123',
      },
    });
    expect(registerRes.statusCode).toBe(201);
    const { token } = registerRes.json();

    // 2. Dona cria um serviço
    const serviceRes = await app.inject({
      method: 'POST',
      url: '/services',
      headers: { authorization: `Bearer ${token}` },
      payload: { name: 'Corte E2E', price: 40, durationMinutes: 30 },
    });
    expect(serviceRes.statusCode).toBe(201);
    const service = serviceRes.json();

    // 3. Precisa de um staff e um client pra criar o agendamento
    //    (staff = a propria dona, ja que ela é "staff" com role owner)
    const decoded = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString()
    );

    const { prisma } = await import('./prisma');
    const client = await prisma.client.create({
      data: { tenantId: decoded.tenantId, name: 'Cliente E2E', contact: 'cliente-e2e@teste.com' },
    });

    // 4. Cliente agenda um horário
    const appointmentRes = await app.inject({
      method: 'POST',
      url: '/appointments',
      headers: { authorization: `Bearer ${token}` },
      payload: {
        clientId: client.id,
        staffId: decoded.staffId,
        serviceId: service.id,
        scheduledAt: '2026-10-01T10:00:00.000Z',
      },
    });

    expect(appointmentRes.statusCode).toBe(201);
    expect(appointmentRes.json().status).toBe('confirmed');

    // 5. Confirma que aparece na listagem
    const listRes = await app.inject({
      method: 'GET',
      url: '/appointments',
      headers: { authorization: `Bearer ${token}` },
    });

    expect(listRes.statusCode).toBe(200);
    expect(listRes.json().length).toBeGreaterThan(0);
  });
});