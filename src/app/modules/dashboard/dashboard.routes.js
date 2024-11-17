import express from "express";
import dashboardControllers from "./dashboard.controllers.js";

const dashboardRouter = express.Router();

dashboardRouter.get('/metrics/retrive', dashboardControllers.getDashboardMetrics)

export default dashboardRouter;