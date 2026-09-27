import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { env } from "./config/env";
import { errorHandler, notFoundHandler } from "./middleware/error-handler";
import { apiRateLimit } from "./middleware/rate-limit";
import { apiRouter } from "./routes";

export function createApp() {
  const app = express();

  // Behind a reverse proxy / load balancer the client IP arrives in
  // X-Forwarded-For; without this every user would share one rate-limit bucket.
  if (env.trustProxy) {
    app.set("trust proxy", env.trustProxy);
  }

  app.use(compression());
  app.use(cors({ origin: env.webOrigin, credentials: true }));
  app.use(express.json());
  app.use(cookieParser());

  // Responses are per-user, so only the browser may cache them, and it must
  // revalidate each time. Express's ETag then turns unchanged responses into an
  // empty 304 instead of re-sending the whole payload.
  app.use("/api", (req, res, next) => {
    if (req.method === "GET") {
      res.set("Cache-Control", "private, no-cache");
    }
    next();
  });

  app.use("/api", apiRateLimit, apiRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
