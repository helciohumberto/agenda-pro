import 'dotenv/config';
import Fastify from 'fastify';
import { authRoutes } from './auth/routes';
import { staffRoutes } from './staff/routes';
import { serviceRoutes } from './services/routes';
import { appointmentRoutes } from './appointments/routes';
import cors from '@fastify/cors';

export function buildApp() {
  const app = Fastify({ logger: false });

  app.register(cors, {
    origin: 'http://localhost:5173',
  });

  app.register(authRoutes);
  app.register(staffRoutes);
  app.register(serviceRoutes);
  app.register(appointmentRoutes);
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