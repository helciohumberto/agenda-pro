import 'dotenv/config';
import Fastify from 'fastify';
import { authRoutes } from './auth/routes';
import { appointmentRoutes } from './appointments/routes';

const app = Fastify({ logger: true });

app.register(authRoutes);
app.register(appointmentRoutes);

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});