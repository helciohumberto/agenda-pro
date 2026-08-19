import { prisma } from '../prisma';

export async function findOrCreateClient(tenantId: string, name: string, contact: string) {
  const existing = await prisma.client.findFirst({ where: { tenantId, contact } });
  if (existing) return existing;

  return prisma.client.create({
    data: { tenant: { connect: { id: tenantId } }, name, contact },
  });
}