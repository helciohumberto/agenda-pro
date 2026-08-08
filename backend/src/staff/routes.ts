import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../auth/middleware';
import { inviteStaff, acceptInvite } from './staff-repository';

const inviteSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.string().min(2),
});

const acceptInviteSchema = z.object({
  staffId: z.string().uuid(),
  password: z.string().min(6),
});

export async function staffRoutes(app: FastifyInstance) {
  app.post('/staff/invite', { preHandler: requireAuth }, async (request, reply) => {
    const { role: requesterRole, tenantId } = request.auth!;

    if (requesterRole !== 'owner') {
      return reply.status(403).send({ error: 'FORBIDDEN', message: 'Só a dona pode convidar funcionários' });
    }

    const parsed = inviteSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'INVALID_INPUT', message: parsed.error.message });
    }

    const staff = await inviteStaff(tenantId, parsed.data);
    return reply.status(201).send({ id: staff.id, name: staff.name, email: staff.email });
  });

  app.post('/staff/accept-invite', async (request, reply) => {
    const parsed = acceptInviteSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'INVALID_INPUT', message: parsed.error.message });
    }

    const { staffId, password } = parsed.data;
    const staff = await acceptInvite(staffId, password);
    return reply.status(200).send({ id: staff.id, message: 'Senha definida com sucesso' });
  });
}