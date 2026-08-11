import 'dotenv/config';
import Fastify from 'fastify';
import { authRoutes } from './auth/routes';
import { staffRoutes } from './staff/routes';
import { serviceRoutes } from './services/routes';
import { appointmentRoutes } from './appointments/routes';
import { createAppointmentRoute } from './appointments/create-route';

export function buildApp() {
  const app = Fastify({ logger: false });
  app.register(authRoutes);
  app.register(staffRoutes);
  app.register(serviceRoutes);
  app.register(appointmentRoutes);
  app.register(createAppointmentRoute);
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