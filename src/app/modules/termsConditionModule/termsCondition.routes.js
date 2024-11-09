import express from "express";
import termsConditionControllers from "./termsCondition.controllers.js";

const termsConditionRouter = express.Router();

termsConditionRouter.post('/create', termsConditionControllers.createTermsCondition)
termsConditionRouter.get('/retrive', termsConditionControllers.getTermsCondition)
termsConditionRouter.patch('/update/:id', termsConditionControllers.updateTermsCondition)

export default termsConditionRouter