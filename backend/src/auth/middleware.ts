import { FastifyRequest, FastifyReply } from 'fastify';
import { verifyToken, TokenPayload } from './jwt';

declare module 'fastify' {
  interface FastifyRequest {
    auth?: TokenPayload;
  }
}

export async function requireAuth(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return reply.status(401).send({ error: 'MISSING_TOKEN', message: 'Token de autenticação ausente' });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const payload = verifyToken(token);
    request.auth = payload;
  } catch {
    return reply.status(401).send({ error: 'INVALID_TOKEN', message: 'Token inválido ou expirado' });
  }
}