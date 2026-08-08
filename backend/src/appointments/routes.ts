import { FastifyInstance } from 'fastify';
import { requireAuth } from '../auth/middleware';
import { prisma } from '../prisma';

export async function appointmentRoutes(app: FastifyInstance) {
  app.get('/appointments', { preHandler: requireAuth }, async (request, reply) => {
    const { tenantId, role, staffId } = request.auth!;

    const where = role === 'owner'
      ? { tenantId }
      : { tenantId, staffId };

    const appointments = await prisma.appointment.findMany({ where });
    return reply.send(appointments);
  });
}