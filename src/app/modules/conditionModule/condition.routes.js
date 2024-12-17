import express from "express";
import conditionControllers from "./condition.controllers.js";
import authorization from "../../middlewares/authorization.js";

const conditionRouter = express.Router();

conditionRouter.post('/create', authorization('super-admin', 'admin'), conditionControllers.createCondition)
conditionRouter.patch('/update/:id', authorization('super-admin', 'admin'), conditionControllers.updateCondition)
conditionRouter.delete('/delete/:id', authorization('super-admin', 'admin'), conditionControllers.deleteCondition)

export default conditionRouter;