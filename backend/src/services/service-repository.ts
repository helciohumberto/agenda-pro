import { prisma } from '../prisma';

interface CreateServiceInput {
  name: string;
  price: number;
  durationMinutes: number;
}

export async function createService(tenantId: string, input: CreateServiceInput) {
  if (input.durationMinutes <= 0) {
    throw new Error('Duração deve ser maior que zero');
  }

  return prisma.service.create({
    data: {
      tenantId,
      name: input.name,
      price: input.price,
      durationMinutes: input.durationMinutes,
    },
  });
}