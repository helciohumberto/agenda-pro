import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../prisma';
import { findOrCreateClient } from './client-repository';
import { createAppointment } from '../appointments/appointment-repository';
import { sendAppointmentConfirmation } from '../notifications/email-service';


const bookSchema = z.object({
  clientName: z.string().min(2),
  clientContact: z.string().min(3),
  serviceId: z.string().uuid(),
  staffId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
});

export async function publicRoutes(app: FastifyInstance) {
  app.get('/public/:tenantId/services', async (request, reply) => {
    const { tenantId } = request.params as { tenantId: string };
    const services = await prisma.service.findMany({ where: { tenantId } });
    return reply.send(services);
  });

  app.get('/public/:tenantId/staff', async (request, reply) => {
    const { tenantId } = request.params as { tenantId: string };
    const staff = await prisma.staff.findMany({
      where: { tenantId },
      select: { id: true, name: true, role: true },
    });
    return reply.send(staff);
  });

  app.post('/public/:tenantId/appointments', async (request, reply) => {
    const { tenantId } = request.params as { tenantId: string };
    const parsed = bookSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'INVALID_INPUT', message: parsed.error.message });
    }

    const { clientName, clientContact, serviceId, staffId, scheduledAt } = parsed.data;

    try {
      const client = await findOrCreateClient(tenantId, clientName, clientContact);
      const appointment = await createAppointment(tenantId, {
        clientId: client.id,
        staffId,
        serviceId,
        scheduledAt: new Date(scheduledAt),
      });

      request.log.info({ tenantId, appointmentId: appointment.id }, 'Agendamento criado');

      const service = await prisma.service.findUnique({ where: { id: serviceId } });

      sendAppointmentConfirmation({
        clientContact,
        clientName,
        serviceName: service!.name,
        scheduledAt: new Date(scheduledAt),
      }); // sem await de proposito -- nao trava a resposta esperando o email

      return reply.status(201).send(appointment);
    } catch (error) {
      if (error instanceof Error && error.message === 'SLOT_UNAVAILABLE') {
        return reply.status(409).send({ error: 'SLOT_UNAVAILABLE', message: 'Esse horário acabou de ser reservado' });
      }
      throw error;
    }
  });
}