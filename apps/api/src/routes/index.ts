import { Router } from "express";
import { authRouter } from "./auth.routes";
import { customerRouter } from "./customer.routes";
import { healthRouter } from "./health";
import { settingsRouter } from "./settings.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/customers", customerRouter);
