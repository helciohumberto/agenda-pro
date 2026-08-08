import 'dotenv/config';
import Fastify from 'fastify';
import { authRoutes } from './auth/routes';
import { appointmentRoutes } from './appointments/routes';
import { serviceRoutes } from './services/routes'
import { staffRoutes } from './staff/routes';


const app = Fastify({ logger: true });

app.register(authRoutes);
app.register(appointmentRoutes);
app.register(serviceRoutes);
app.register(staffRoutes);

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});