import 'dotenv/config';
import Fastify from 'fastify';
import { authRoutes } from './auth/routes';

const app = Fastify({ logger: true });

app.register(authRoutes);

app.listen({ port: 3000 }, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});