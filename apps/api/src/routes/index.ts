import { Router } from "express";
import { authRouter } from "./auth.routes";
import { healthRouter } from "./health";
import { settingsRouter } from "./settings.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/settings", settingsRouter);
