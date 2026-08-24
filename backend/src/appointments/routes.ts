import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../auth/middleware';
import { prisma } from '../prisma';
import { createAppointment } from './appointment-repository';

const createAppointmentSchema = z.object({
  clientId: z.string().uuid(),
  staffId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
});

export async function appointmentRoutes(app: FastifyInstance) {
  app.get('/appointments', { preHandler: requireAuth }, async (request, reply) => {
    const { tenantId, role, staffId } = request.auth!;
    const { page = '1', limit = '20' } = request.query as { page?: string; limit?: string };

    const where = role === 'owner' ? { tenantId } : { tenantId, staffId };
    const take = Number(limit);
    const skip = (Number(page) - 1) * take;

    const [appointments, total] = await Promise.all([
      prisma.appointment.findMany({
        where,
        take,
        skip,
        orderBy: { scheduledAt: 'desc' },
        include: {
          client: { select: { name: true, contact: true } },
          service: { select: { name: true, price: true } },
          staff: { select: { name: true } },
        },
      }),
      prisma.appointment.count({ where }),
    ]);

    return reply.send({ data: appointments, total, page: Number(page), limit: take });
  });

  app.post('/appointments', { preHandler: requireAuth }, async (request, reply) => {
    const parsed = createAppointmentSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'INVALID_INPUT', message: parsed.error.message });
    }

    const { tenantId } = request.auth!;

    try {
      const appointment = await createAppointment(tenantId, {
        ...parsed.data,
        scheduledAt: new Date(parsed.data.scheduledAt),
      });
      return reply.status(201).send(appointment);
    } catch (error) {
      if (error instanceof Error && error.message === 'SLOT_UNAVAILABLE') {
        return reply.status(409).send({ error: 'SLOT_UNAVAILABLE', message: 'Esse horário acabou de ser reservado' });
      }
      throw error;
    }
  });
}