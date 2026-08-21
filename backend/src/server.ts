import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';
import helmet from '@fastify/helmet';
import { authRoutes } from './auth/routes';
import { staffRoutes } from './staff/routes';
import { serviceRoutes } from './services/routes';
import { appointmentRoutes } from './appointments/routes';
import { publicRoutes } from './public/routes';

export function buildApp() {
  const app = Fastify({ logger: false });

  app.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  app.register(helmet);

  app.register(cors, {
    origin: 'http://localhost:5173',
  });

  app.register(authRoutes);
  app.register(staffRoutes);
  app.register(serviceRoutes);
  app.register(appointmentRoutes);
  app.register(publicRoutes);

  return app;
}

if (require.main === module) {
  const app = buildApp();
  app.listen({ port: 3000 }, (err) => {
    if (err) {
      app.log.error(err);
      process.exit(1);
    }
  });
}