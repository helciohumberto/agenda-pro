import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { requireAuth } from '../auth/middleware';
import { createService } from './service-repository';

const createServiceSchema = z.object({
  name: z.string().min(2),
  price: z.number().positive(),
  durationMinutes: z.number().int().positive(),
});

export async function serviceRoutes(app: FastifyInstance) {
  app.post('/services', { preHandler: requireAuth }, async (request, reply) => {
    const parsed = createServiceSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'INVALID_INPUT', message: parsed.error.message });
    }

    const { tenantId } = request.auth!;
    const service = await createService(tenantId, parsed.data);
    return reply.status(201).send(service);
  });
}