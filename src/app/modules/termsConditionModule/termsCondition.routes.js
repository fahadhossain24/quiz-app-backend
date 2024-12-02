import express from "express";
import termsConditionControllers from "./termsCondition.controllers.js";
import authorization from "../../middlewares/authorization.js";

const termsConditionRouter = express.Router();

termsConditionRouter.post('/create', authorization('admin', 'super-admin'), termsConditionControllers.createTermsCondition)
termsConditionRouter.get('/retrive', authorization('user', 'admin', 'super-admin'), termsConditionControllers.getTermsCondition)
termsConditionRouter.patch('/update/:id', authorization('admin', 'super-admin'), termsConditionControllers.updateTermsCondition)

export default termsConditionRouter