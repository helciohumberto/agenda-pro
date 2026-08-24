import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import rateLimit from "@fastify/rate-limit";
import helmet from "@fastify/helmet";
import { authRoutes } from "./auth/routes";
import { staffRoutes } from "./staff/routes";
import { serviceRoutes } from "./services/routes";
import { appointmentRoutes } from "./appointments/routes";
import { publicRoutes } from "./public/routes";
import { healthRoutes } from './health/routes';

export function buildApp() {
  const app = Fastify({
    logger: {
      level: process.env.NODE_ENV === "production" ? "info" : "debug",
      transport:
        process.env.NODE_ENV === "production"
          ? undefined
          : { target: "pino-pretty" },
    },
  });

  app.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute",
  });

  app.register(helmet);

  app.register(cors, {
    origin: "http://localhost:5173",
  });

  app.register(authRoutes);
  app.register(staffRoutes);
  app.register(serviceRoutes);
  app.register(appointmentRoutes);
  app.register(publicRoutes);
  app.register(healthRoutes);


  app.setErrorHandler((error, request, reply) => {
    request.log.error(error);

    if (error.validation) {
      return reply
        .status(400)
        .send({ error: "INVALID_INPUT", message: "Dados inválidos" });
    }

    return reply.status(500).send({
      error: "INTERNAL_ERROR",
      message: "Algo deu errado. Tente novamente.",
    });
  });

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
