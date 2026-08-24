import { FastifyInstance } from 'fastify';
import { prisma } from '../prisma';

export async function healthRoutes(app: FastifyInstance) {
  app.get('/health', async (request, reply) => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return reply.status(200).send({ status: 'ok', database: 'connected' });
    } catch (error) {
      request.log.error(error);
      return reply.status(503).send({ status: 'error', database: 'disconnected' });
    }
  });

  app.get('/health/metrics', async (request, reply) => {
    const totalAppointments = await prisma.appointment.count();
    const confirmedAppointments = await prisma.appointment.count({ where: { status: 'confirmed' } });
    const totalTenants = await prisma.tenant.count();

    return reply.send({
      totalAppointments,
      confirmedAppointments,
      totalTenants,
      timestamp: new Date().toISOString(),
    });
  });
}