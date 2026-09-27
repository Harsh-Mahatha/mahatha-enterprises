import { Router } from "express";
import { changePasswordSchema, loginSchema } from "@mahatha/validation";
import * as authController from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth";
import { loginRateLimit } from "../middleware/rate-limit";
import { validateBody } from "../middleware/validate";

export const authRouter = Router();

authRouter.post("/login", loginRateLimit, validateBody(loginSchema), authController.login);
authRouter.post("/logout", authController.logout);
authRouter.get("/me", requireAuth, authController.me);
authRouter.post("/change-password", requireAuth, validateBody(changePasswordSchema), authController.changePassword);
