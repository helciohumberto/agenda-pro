import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma } from '../prisma';
import { createService } from './service-repository';

describe('criação de serviço', () => {
  let tenantId: string;

  beforeAll(async () => {
    const tenant = await prisma.tenant.create({ data: { businessName: 'Salão Teste TDD' } });
    tenantId = tenant.id;
  });

  it('cria um serviço com nome, preço e duração', async () => {
    const service = await createService(tenantId, {
      name: 'Corte de cabelo',
      price: 30,
      durationMinutes: 30,
    });

    expect(service.name).toBe('Corte de cabelo');
    expect(service.tenantId).toBe(tenantId);
  });

  it('rejeita duração zero ou negativa', async () => {
    await expect(
      createService(tenantId, { name: 'Serviço inválido', price: 10, durationMinutes: 0 })
    ).rejects.toThrow();
  });
});