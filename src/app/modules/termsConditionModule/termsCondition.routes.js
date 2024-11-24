import express from "express";
import termsConditionControllers from "./termsCondition.controllers.js";
import authorization from "../../middlewares/authorization.js";

const termsConditionRouter = express.Router();

termsConditionRouter.post('/create', authorization('admin'), termsConditionControllers.createTermsCondition)
termsConditionRouter.get('/retrive', authorization('user', 'admin'), termsConditionControllers.getTermsCondition)
termsConditionRouter.patch('/update/:id', authorization('admin'), termsConditionControllers.updateTermsCondition)

export default termsConditionRouter