import { z } from 'zod';
import { requireAuth } from '../auth/middleware';
import { createAppointment } from './appointment-repository';

const createAppointmentSchema = z.object({
  clientId: z.string().uuid(),
  staffId: z.string().uuid(),
  serviceId: z.string().uuid(),
  scheduledAt: z.string().datetime(),
});

// dentro da função appointmentRoutes que já existe, adiciona:
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