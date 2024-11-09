import express from "express";
import sponsorControllers from "./sponsor.controllers.js";
import requestValidator from "../../middlewares/requestValidator.js";
import SponsorValidationZodSchema from "./sponsor.validation.js";

const sponsorRouter = express.Router();

sponsorRouter.post('/splash-screen/create', sponsorControllers.createSplashScreen)
sponsorRouter.patch('/splash-screen/update/:id', requestValidator(SponsorValidationZodSchema.getSpecificSplashScreenZodSchema), sponsorControllers.updateSplashScreen)
sponsorRouter.post('/ads/create', sponsorControllers.createAds)
sponsorRouter.patch('/ads/update/:id', requestValidator(SponsorValidationZodSchema.getSpecificAdsZodSchema), sponsorControllers.updateAds)
sponsorRouter.get('/retrive', sponsorControllers.getSponsor)

export default sponsorRouter;