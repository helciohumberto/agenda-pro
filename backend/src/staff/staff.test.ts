import { describe, it, expect, beforeAll } from 'vitest';
import { prisma } from '../prisma';
import { inviteStaff, acceptInvite } from './staff-repository';

describe('convite de funcionário', () => {
  let tenantId: string;

  beforeAll(async () => {
    const tenant = await prisma.tenant.create({ data: { businessName: 'Salão TDD Staff' } });
    tenantId = tenant.id;
  });

  it('cria staff convidado sem senha definida', async () => {
    const staff = await inviteStaff(tenantId, { name: 'João', email: 'joao-tdd@teste.com', role: 'Cabeleireiro' });

    expect(staff.name).toBe('João');
    expect(staff.passwordHash).toBeNull();
  });

  it('funcionário aceita convite e define senha', async () => {
    const staff = await inviteStaff(tenantId, { name: 'Maria', email: 'maria-tdd@teste.com', role: 'Cabeleireira' });

    const updated = await acceptInvite(staff.id, 'senhaNova123');

    expect(updated.passwordHash).not.toBeNull();
  });
});