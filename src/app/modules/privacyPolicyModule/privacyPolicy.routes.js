import express from "express";
import privacyPolicyControllers from "./privacyPolicy.controllers.js";
import authorization from "../../middlewares/authorization.js";


const privacyPolicyRouter = express.Router();

privacyPolicyRouter.post('/create', authorization('admin', 'super-admin'), privacyPolicyControllers.createPrivacyPolicy)
privacyPolicyRouter.get('/retrive', authorization('user', 'admin', 'super-admin'), privacyPolicyControllers.getPrivacyPolicy)
privacyPolicyRouter.patch('/update/:id', authorization('admin', 'super-admin'), privacyPolicyControllers.updatePrivacyPolicy)

export default privacyPolicyRouter