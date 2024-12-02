import express from "express";
import dashboardControllers from "./dashboard.controllers.js";
import authorization from "../../middlewares/authorization.js";

const dashboardRouter = express.Router();

dashboardRouter.get('/metrics/retrive', authorization('admin', 'super-admin'), dashboardControllers.getDashboardMetrics)

export default dashboardRouter;