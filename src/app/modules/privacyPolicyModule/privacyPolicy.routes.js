import express from "express";
import privacyPolicyControllers from "./privacyPolicy.controllers.js";


const privacyPolicyRouter = express.Router();

privacyPolicyRouter.post('/create', privacyPolicyControllers.createPrivacyPolicy)
privacyPolicyRouter.get('/retrive', privacyPolicyControllers.getPrivacyPolicy)
privacyPolicyRouter.patch('/update/:id', privacyPolicyControllers.updatePrivacyPolicy)

export default privacyPolicyRouter