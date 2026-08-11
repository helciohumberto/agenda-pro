import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';

interface CreateAppointmentInput {
  clientId: string;
  staffId: string;
  serviceId: string;
  scheduledAt: Date;
}

export async function createAppointment(tenantId: string, input: CreateAppointmentInput) {
  try {
    return await prisma.appointment.create({
      data: {
        tenant: { connect: { id: tenantId } },
        client: { connect: { id: input.clientId } },
        staff: { connect: { id: input.staffId } },
        service: { connect: { id: input.serviceId } },
        scheduledAt: input.scheduledAt,
        status: 'confirmed',
      },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new Error('SLOT_UNAVAILABLE');
    }
    throw error;
  }
}