import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from './prisma';

describe('isolamento entre tenants', () => {
  let tenantA: string, tenantB: string;

  beforeAll(async () => {
    const a = await prisma.tenant.create({ data: { businessName: 'Salão A' } });
    const b = await prisma.tenant.create({ data: { businessName: 'Salão B' } });
    tenantA = a.id;
    tenantB = b.id;

    await prisma.client.create({ data: { tenantId: tenantA, name: 'Cliente A', contact: 'a@a.com' } });
    await prisma.client.create({ data: { tenantId: tenantB, name: 'Cliente B', contact: 'b@b.com' } });
  });

  it('tenant A não vê clientes do tenant B', async () => {
    const clientesDoA = await prisma.client.findMany({ where: { tenantId: tenantA } });
    const nomes = clientesDoA.map(c => c.name);

    expect(nomes).toContain('Cliente A');
    expect(nomes).not.toContain('Cliente B');
  });
});