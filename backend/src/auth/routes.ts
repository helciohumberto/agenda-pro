import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { prisma } from '../prisma';
import { hashPassword, comparePassword } from './password';
import { generateToken } from './jwt';

const registerSchema = z.object({
  businessName: z.string().min(2),
  ownerName: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function authRoutes(app: FastifyInstance) {
  app.post('/auth/register', async (request, reply) => {
    const parsed = registerSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.status(400).send({ error: 'INVALID_INPUT', message: parsed.error.message });
    }

    const { businessName, ownerName, email, password } = parsed.data;

    const existing = await prisma.staff.findUnique({ where: { email } });
    if (existing) {
      return reply.status(409).send({ error: 'EMAIL_TAKEN', message: 'Email já cadastrado' });
    }

    const passwordHash = await hashPassword(password);

    const tenant = await prisma.tenant.create({ data: { businessName } });
    await prisma.business.create({ data: { tenantId: tenant.id, name: businessName } });
    const owner = await prisma.staff.create({
      data: { tenantId: tenant.id, name: ownerName, email, role: 'owner', passwordHash },
    });

    const token = generateToken({ staffId: owner.id, tenantId: tenant.id, role: 'owner' });
    return reply.status(201).send({ token });
  });

  app.post('/auth/login', async (request, reply) => {
    const { email, password } = request.body as { email: string; password: string };

    const staff = await prisma.staff.findUnique({ where: { email } });
    if (!staff || !(await comparePassword(password, staff.passwordHash))) {
      return reply.status(401).send({ error: 'INVALID_CREDENTIALS', message: 'Email ou senha incorretos' });
    }

    const token = generateToken({ staffId: staff.id, tenantId: staff.tenantId, role: staff.role ?? 'staff' });
    return reply.status(200).send({ token });
  });
}