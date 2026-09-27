import { Router } from "express";
import { authRouter } from "./auth.routes";
import { customerRouter } from "./customer.routes";
import { dashboardRouter } from "./dashboard.routes";
import { healthRouter } from "./health";
import { inventoryRouter } from "./inventory.routes";
import { invoiceRouter } from "./invoice.routes";
import { paymentRouter } from "./payment.routes";
import { productRouter } from "./product.routes";
import { reportsRouter } from "./reports.routes";
import { settingsRouter } from "./settings.routes";
import { unitRouter } from "./unit.routes";

export const apiRouter = Router();

apiRouter.use("/health", healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use("/settings", settingsRouter);
apiRouter.use("/customers", customerRouter);
apiRouter.use("/products", productRouter);
apiRouter.use("/units", unitRouter);
apiRouter.use("/inventory", inventoryRouter);
apiRouter.use("/payments", paymentRouter);
apiRouter.use("/invoices", invoiceRouter);
apiRouter.use("/dashboard", dashboardRouter);
apiRouter.use("/reports", reportsRouter);
